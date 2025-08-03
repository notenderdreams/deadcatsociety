# Enhanced chains.py with improved error handling and fallback mechanisms
import os
import uuid
import PyPDF2
import io
import requests
import re
import json
from typing import List, Dict, Optional, Any
from urllib.parse import urlparse, parse_qs
from dotenv import load_dotenv

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain_core.documents import Document
from langchain.prompts import PromptTemplate

from supabase import create_client, Client

load_dotenv()

class NotebookRAG:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        
        self.supabase_url = os.environ.get("SUPABASE_URL")
        self.supabase_key = os.environ.get("SUPABASE_ANON_KEY")
        
        if not all([self.supabase_url, self.supabase_key]):
            raise ValueError("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables")
            
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.3,
            max_retries=2,
            api_key=os.environ["GOOGLE_API_KEY"]
        )
        
        self._init_database()

    def _init_database(self):
        """Initialize the database schema using Supabase client."""
        try:
            # Check if table exists by trying to query it
            try:
                result = self.supabase.table("notebook_documents").select("id").limit(1).execute()
                print("✅ Database table exists and is accessible")
                
                # Test if RPC function exists
                try:
                    test_embedding = [0.0] * 768  # Test with zero vector
                    self.supabase.rpc('match_documents', {
                        'query_embedding': test_embedding,
                        'match_threshold': 0.0,
                        'match_count': 1
                    }).execute()
                    print("✅ Vector search RPC function is available")
                except Exception as rpc_error:
                    print(f"⚠️ Vector search RPC function not available: {str(rpc_error)}")
                    print("Please create the RPC function using the provided SQL script")
                    
            except Exception:
                print("Creating database schema via SQL editor...")
                print("Please run this SQL in your Supabase SQL Editor:")
                print("""
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table
CREATE TABLE IF NOT EXISTS notebook_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id TEXT NOT NULL,
    title TEXT,
    page_number INTEGER,
    chunk_id TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notebook_documents_note_id ON notebook_documents(note_id);
CREATE INDEX IF NOT EXISTS idx_notebook_documents_chunk_id ON notebook_documents(chunk_id);
CREATE INDEX IF NOT EXISTS idx_notebook_documents_embedding ON notebook_documents 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
                """)
                raise Exception("Please create the database schema first using the SQL above")
                
        except Exception as e:
            print(f"Database initialization: {str(e)}")

    def _vector_search(self, query_embedding: List[float], match_threshold: float = 0.3, match_count: int = 10) -> List[Dict]:
        """Perform vector similarity search with fallback mechanisms."""
        try:
            # Try RPC function first
            result = self.supabase.rpc(
                'match_documents',
                {
                    'query_embedding': query_embedding,
                    'match_threshold': match_threshold,
                    'match_count': match_count
                }
            ).execute()
            return result.data
            
        except Exception as rpc_error:
            print(f"RPC search failed: {str(rpc_error)}, trying manual vector search...")
            
            try:
                # Fallback: Manual vector search using raw SQL
                # This requires executing raw SQL through Supabase
                result = self.supabase.table("notebook_documents").select(
                    "*", 
                    "embedding"
                ).execute()
                
                # Calculate similarities manually (this is inefficient but works as fallback)
                import numpy as np
                query_vec = np.array(query_embedding)
                
                matches = []
                for row in result.data:
                    if row.get('embedding'):
                        doc_vec = np.array(row['embedding'])
                
                        similarity = 1 - np.dot(query_vec, doc_vec) / (np.linalg.norm(query_vec) * np.linalg.norm(doc_vec))
                        similarity = float(1 - similarity)  
                        
                        if similarity > match_threshold:
                            row['similarity'] = similarity
                            matches.append(row)
                
                # Sort by similarity and limit results
                matches.sort(key=lambda x: x['similarity'], reverse=True)
                return matches[:match_count]
                
            except Exception as manual_error:
                print(f"Manual vector search failed: {str(manual_error)}, falling back to text search...")
                # Last resort: text-based search
                return []

    def debug_search(self, question: str, n_results: int = 20) -> Dict:
        """Debug function using vector similarity search."""
        try:
            query_embedding = self.embeddings.embed_query(question)
            
            # Use improved vector search with fallbacks
            results = self._vector_search(query_embedding, match_threshold=0.0, match_count=n_results)
            
            debug_info = []
            for row in results:
                debug_info.append({
                    "title": row.get("title", "Unknown"),
                    "page": row.get("page_number", "?"),
                    "chunk_id": row.get("chunk_id", "?"),
                    "distance": round(1 - row.get("similarity", 0), 4),
                    "confidence": round(row.get("similarity", 0), 4),
                    "content_preview": row.get("content", "")[:200] + "..." if len(row.get("content", "")) > 200 else row.get("content", ""),
                    "full_content": row.get("content", "")
                })
            
            return {
                "query": question,
                "total_results": len(debug_info),
                "results": debug_info
            }
            
        except Exception as e:
            print(f"Debug search error: {str(e)}")
            # Fallback to text search
            return self._fallback_text_search(question, n_results)

    def _fallback_text_search(self, question: str, n_results: int) -> Dict:
        """Fallback search using basic text matching."""
        try:
            # Simple text search as fallback
            result = self.supabase.table("notebook_documents").select("*").ilike(
                "content", f"%{question}%"
            ).limit(n_results).execute()
            
            debug_info = []
            for row in result.data:
                debug_info.append({
                    "title": row.get("title", "Unknown"),
                    "page": row.get("page_number", "?"),
                    "chunk_id": row.get("chunk_id", "?"),
                    "distance": 0.5,  # Default distance for text search
                    "confidence": 0.5,  # Default confidence
                    "content_preview": row.get("content", "")[:200] + "...",
                    "full_content": row.get("content", "")
                })
            
            return {
                "query": question,
                "total_results": len(debug_info),
                "results": debug_info,
                "note": "Using fallback text search"
            }
        except Exception as e:
            return {"error": str(e), "query": question, "total_results": 0, "results": []}

    def search_by_keyword(self, keyword: str) -> Dict:
        """Search for chunks containing specific keywords."""
        try:
            result = self.supabase.table("notebook_documents").select("*").ilike(
                "content", f"%{keyword}%"
            ).execute()
            
            matching_chunks = []
            for row in result.data:
                matching_chunks.append({
                    "title": row.get("title", "Unknown"),
                    "page": row.get("page_number", "?"),
                    "chunk_id": row.get("chunk_id", "?"),
                    "content": row.get("content", "")
                })
            
            return {
                "keyword": keyword,
                "total_matches": len(matching_chunks),
                "matches": matching_chunks
            }
        except Exception as e:
            return {"error": str(e)}

    def get_all_chunks_info(self) -> Dict:
        """Get information about all chunks in the database."""
        try:
            result = self.supabase.table("notebook_documents").select(
                "title, page_number, chunk_id, content"
            ).execute()
            
            chunks_info = []
            for row in result.data:
                content = row.get("content", "")
                chunks_info.append({
                    "title": row.get("title", "Unknown"),
                    "page": row.get("page_number", "?"),
                    "chunk_id": row.get("chunk_id", "?"),
                    "content_length": len(content),
                    "content_preview": content[:100] + ("..." if len(content) > 100 else "")
                })
            
            return {
                "total_chunks": len(chunks_info),
                "chunks": chunks_info
            }
        except Exception as e:
            return {"error": str(e)}

    def ask_notebook(self, question: str, debug_mode: bool = False) -> Dict:
        """Ask question using vector similarity and keyword search with improved error handling."""
        try:
            print(f"Processing question: {question}")
            
            # Generate query embedding
            try:
                query_embedding = self.embeddings.embed_query(question)
                print("✅ Query embedding generated successfully")
            except Exception as e:
                print(f"❌ Failed to generate embedding: {str(e)}")
                raise Exception(f"Failed to generate query embedding: {str(e)}")
            
            # Try vector similarity search first
            semantic_matches = []
            try:
                semantic_matches = self._vector_search(query_embedding, match_threshold=0.3, match_count=10)
                print(f"✅ Found {len(semantic_matches)} semantic matches")
            except Exception as e:
                print(f"⚠️ Vector search failed: {str(e)}")
                # Continue with keyword search only
            
            # Keyword search as backup
            question_keywords = [word.strip().lower() for word in question.split() if len(word.strip()) > 2]
            keyword_matches = []
            
            if question_keywords:
                for keyword in question_keywords[:3]:  # Limit to first 3 keywords
                    try:
                        result = self.supabase.table("notebook_documents").select("*").ilike(
                            "content", f"%{keyword}%"
                        ).limit(3).execute()
                        for row in result.data:
                            row["keyword_score"] = 1
                            row["similarity"] = 0.6  # Default similarity for keyword matches
                            keyword_matches.append(row)
                        print(f"✅ Found {len(result.data)} matches for keyword '{keyword}'")
                    except Exception as e:
                        print(f"⚠️ Keyword search failed for '{keyword}': {str(e)}")
                        continue

            # Combine results
            combined_docs = []
            combined_sources = []
            seen_chunk_ids = set()
            
            # Add semantic results
            for row in semantic_matches[:5]:
                chunk_id = row.get("chunk_id")
                similarity = row.get("similarity", 0.5)
                
                if chunk_id not in seen_chunk_ids and similarity > 0.3:
                    metadata = {
                        "title": row.get("title"),
                        "page_number": row.get("page_number"),
                        "chunk_id": chunk_id,
                        "note_id": row.get("note_id")
                    }
                    combined_docs.append(Document(page_content=row.get("content", ""), metadata=metadata))
                    combined_sources.append({
                        "title": row.get("title", "Unknown Document"),
                        "page_number": row.get("page_number", 1),
                        "content_preview": row.get("content", "")[:150] + "..." if len(row.get("content", "")) > 150 else row.get("content", ""),
                        "confidence": round(float(similarity), 3),
                        "note_id": row.get("note_id", "unknown"),
                        "match_type": "semantic"
                    })
                    seen_chunk_ids.add(chunk_id)
            
            # Add keyword matches
            for row in keyword_matches[:3]:
                chunk_id = row.get("chunk_id")
                if chunk_id not in seen_chunk_ids:
                    metadata = {
                        "title": row.get("title"),
                        "page_number": row.get("page_number"),
                        "chunk_id": chunk_id,
                        "note_id": row.get("note_id")
                    }
                    combined_docs.append(Document(page_content=row.get("content", ""), metadata=metadata))
                    combined_sources.append({
                        "title": row.get("title", "Unknown Document"),
                        "page_number": row.get("page_number", 1),
                        "content_preview": row.get("content", "")[:150] + "..." if len(row.get("content", "")) > 150 else row.get("content", ""),
                        "confidence": 0.6,  # Fixed confidence for keyword matches
                        "note_id": row.get("note_id", "unknown"),
                        "match_type": "keyword"
                    })
                    seen_chunk_ids.add(chunk_id)
            
            print(f"✅ Combined {len(combined_docs)} documents for answer generation")
            
            if not combined_docs:
                return {
                    "answer": "I couldn't find any relevant information in the uploaded notes. This might be because:\n1. The vector search function is not set up properly\n2. No documents match your query\n3. The question requires information not available in the knowledge base",
                    "sources": [],
                    "total_sources_found": 0,
                    "debug_info": {
                        "semantic_results_count": len(semantic_matches),
                        "keyword_matches_count": len(keyword_matches),
                        "combined_docs_count": 0,
                        "query_keywords": question_keywords
                    } if debug_mode else {}
                }

            # Generate answer
            try:
                answer = self._generate_notebook_answer(combined_docs, question)
                print("✅ Answer generated successfully")
            except Exception as e:
                print(f"❌ Failed to generate answer: {str(e)}")
                answer = "I found relevant information but encountered an error while generating the answer. Please try rephrasing your question."
            
            result = {
                "answer": answer,
                "sources": combined_sources,
                "total_sources_found": len(combined_sources)
            }
            
            if debug_mode:
                result["debug_info"] = {
                    "semantic_results_count": len(semantic_matches),
                    "keyword_matches_count": len(keyword_matches),
                    "combined_docs_count": len(combined_docs),
                    "query_keywords": question_keywords
                }
            
            return result
            
        except Exception as e:
            error_msg = f"Query processing failed: {str(e)}"
            print(f"❌ {error_msg}")
            raise Exception(error_msg)

    def add_pdf_to_notebook(self, drive_url: str, note_id: str, title: str = None) -> bool:
        """Add a PDF to the universal knowledge base."""
        try:
            pdf_bytes = self._download_from_drive(drive_url)
            documents = self._process_pdf(pdf_bytes, note_id, title)
            self._add_to_knowledge_base(documents)
            return True
        except Exception as e:
            raise Exception(f"Failed to add PDF: {str(e)}")

    def remove_from_notebook(self, note_id: str) -> bool:
        """Remove a document from the knowledge base."""
        try:
            result = self.supabase.table("notebook_documents").delete().eq(
                "note_id", note_id
            ).execute()
            
            return len(result.data) > 0
            
        except Exception as e:
            raise Exception(f"Remove failed: {str(e)}")

    def get_notebook_stats(self) -> Dict:
        """Get statistics about the knowledge base."""
        try:
            # Count total chunks
            chunks_result = self.supabase.table("notebook_documents").select(
                "note_id", count="exact"
            ).execute()
            total_chunks = chunks_result.count
            
            # Count unique documents
            docs_result = self.supabase.table("notebook_documents").select(
                "note_id"
            ).execute()
            
            unique_docs = set()
            for row in docs_result.data:
                unique_docs.add(row.get("note_id"))
            
            return {
                "total_documents": len(unique_docs),
                "total_chunks": total_chunks,
                "status": "ready"
            }
            
        except Exception as e:
            return {
                "total_documents": 0,
                "total_chunks": 0,
                "status": "error",
                "error": str(e)
            }

    def _process_pdf(self, pdf_bytes: bytes, note_id: str, title: str) -> List[Document]:
        """Process PDF with optimized chunking."""
        reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        documents = []
        
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=200,
            separators=["\n\n", "\n", ". ", "! ", "? ", " ", ""]
        )

        for page_num, page in enumerate(reader.pages, 1):
            text = page.extract_text().strip()
            if text:
                chunks = splitter.split_text(text)
                for chunk_idx, chunk in enumerate(chunks):
                    if len(chunk.strip()) > 50:
                        doc_metadata = {
                            "note_id": note_id,
                            "title": title or f"Document {note_id}",
                            "page_number": page_num,
                            "chunk_id": f"{note_id}_p{page_num}_c{chunk_idx}"
                        }
                        documents.append(Document(page_content=chunk.strip(), metadata=doc_metadata))

        return documents

    def _download_from_drive(self, drive_url: str) -> bytes:
        """Download PDF from Google Drive."""
        file_id = self._extract_file_id(drive_url)
        if not file_id:
            raise ValueError("Invalid Google Drive URL format")

        download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
        session = requests.Session()
        
        response = session.get(download_url, stream=True)
        response.raise_for_status()

        if self._is_confirmation_page(response):
            response = self._handle_confirmation(session, download_url, response)

        content = response.content
        if not content or not content.startswith(b'%PDF-'):
            raise ValueError("Downloaded file is not a valid PDF")

        return content

    def _extract_file_id(self, url: str) -> Optional[str]:
        """Extract file ID from Google Drive URL."""
        if '/file/d/' in url:
            match = re.search(r'/file/d/([a-zA-Z0-9-_]+)', url)
            return match.group(1) if match else None
        elif 'id=' in url:
            parsed = urlparse(url)
            params = parse_qs(parsed.query)
            return params.get('id', [None])[0]
        return None

    def _is_confirmation_page(self, response) -> bool:
        """Check if response is a Google Drive confirmation page."""
        content_type = response.headers.get('content-type', '')
        return 'text/html' in content_type and b'Google Drive' in response.content[:1000]

    def _handle_confirmation(self, session, url, response):
        """Handle Google Drive virus scan confirmation."""
        content = ""
        for chunk in response.iter_content(chunk_size=1024):
            if isinstance(chunk, bytes):
                try:
                    content += chunk.decode('utf-8')
                except UnicodeDecodeError:
                    content += chunk.decode('utf-8', errors='ignore')
            if len(content) > 10000:
                break

        confirm_match = re.search(r'confirm=([^&\'\"]+)', content)
        if confirm_match:
            confirm_url = f"{url}&confirm={confirm_match.group(1)}"
            response = session.get(confirm_url, stream=True)
            response.raise_for_status()

        return response

    def _add_to_knowledge_base(self, documents: List[Document]):
        """Add documents with embeddings to Supabase using client API."""
        if not documents:
            raise ValueError("No documents to add")
            
        try:
            # Generate embeddings
            texts = [doc.page_content for doc in documents]
            print(f"Generating embeddings for {len(texts)} chunks...")
            embeddings = self.embeddings.embed_documents(texts)
            
            # Prepare data for bulk insert
            rows_to_insert = []
            for doc, embedding in zip(documents, embeddings):
                rows_to_insert.append({
                    "note_id": doc.metadata["note_id"],
                    "title": doc.metadata["title"],
                    "page_number": doc.metadata["page_number"],
                    "chunk_id": doc.metadata["chunk_id"],
                    "content": doc.page_content,
                    "embedding": embedding,
                    "metadata": doc.metadata
                })
            
            # Insert in batches
            batch_size = 10
            for i in range(0, len(rows_to_insert), batch_size):
                batch = rows_to_insert[i:i + batch_size]
                
                result = self.supabase.table("notebook_documents").upsert(
                    batch,
                    on_conflict="chunk_id"
                ).execute()
                
                print(f"Inserted batch {i//batch_size + 1}/{(len(rows_to_insert) + batch_size - 1)//batch_size}")
            
            print(f"✅ Successfully added {len(documents)} chunks to knowledge base")
                
        except Exception as e:
            raise Exception(f"Failed to add documents to knowledge base: {str(e)}")

    def _generate_notebook_answer(self, documents: List[Document], question: str) -> str:
        """Generate comprehensive answer with proper citations."""
        prompt = PromptTemplate(
            template="""You are an AI assistant with access to a comprehensive knowledge base of study materials and notes. 
Your task is to provide thorough, accurate answers using the provided documents.

CITATION RULES:
- Always cite sources using the format: [Document Title, Page X]
- When information comes from multiple sources, cite each one
- Use phrases like "According to...", "As mentioned in...", "Based on..."

ANSWER GUIDELINES:
- Provide comprehensive answers that synthesize information from multiple sources
- Explain concepts clearly and thoroughly
- If documents contain conflicting information, acknowledge this
- If the question cannot be fully answered from the documents, state what information is available

Available Documents:
{context}

Question: {question}

Provide a comprehensive answer with proper citations:""",
            input_variables=["context", "question"]
        )

        # Create detailed context from documents
        context = ""
        for i, doc in enumerate(documents):
            title = doc.metadata.get("title", "Unknown Document")
            page = doc.metadata.get("page_number", "?")
            context += f"\n--- Source {i+1}: [{title}, Page {page}] ---\n{doc.page_content}\n"

        chain = load_qa_chain(self.llm, chain_type="stuff", prompt=prompt)
        result = chain.invoke({
            "input_documents": documents,
            "context": context,
            "question": question
        })
        
        return result.get("output_text", "I apologize, but I couldn't generate a comprehensive answer from the available documents.")


def debug_search(question: str, n_results: int = 20) -> Dict:
    """Debug what the search is finding."""
    notebook = NotebookRAG()
    return notebook.debug_search(question, n_results)

def search_keyword(keyword: str) -> Dict:
    """Search for specific keywords."""
    notebook = NotebookRAG()
    return notebook.search_by_keyword(keyword)

def get_all_chunks() -> Dict:
    """Get all chunk information."""
    notebook = NotebookRAG()
    return notebook.get_all_chunks_info()

def ask_question_debug(question: str) -> Dict:
    """Ask question with debug mode."""
    notebook = NotebookRAG()
    return notebook.ask_notebook(question, debug_mode=True)

def add_pdf(drive_url: str, note_id: str, title: str = None) -> bool:
    """Add a PDF to the universal knowledge base."""
    notebook = NotebookRAG()
    return notebook.add_pdf_to_notebook(drive_url, note_id, title)

def ask_question(question: str) -> Dict:
    """Ask a question to the entire knowledge base."""
    notebook = NotebookRAG()
    return notebook.ask_notebook(question)

def remove_pdf(note_id: str) -> bool:
    """Remove a PDF from the knowledge base."""
    notebook = NotebookRAG()
    return notebook.remove_from_notebook(note_id)

def get_stats() -> Dict:
    """Get knowledge base statistics."""
    notebook = NotebookRAG()
    return notebook.get_notebook_stats()