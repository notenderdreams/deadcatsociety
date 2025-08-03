from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  
from pydantic import BaseModel
from typing import Optional
import uvicorn

from src_limi.chains import (
    add_pdf, ask_question, remove_pdf, get_stats,
    debug_search, search_keyword, get_all_chunks, ask_question_debug
)

app = FastAPI(
    title="Limi Backend",
    description="Ai part of .deadcatsociety",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  
        "http://127.0.0.1:3000",
        "http://localhost:3001",  
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Request/Response Models
class AddPDFRequest(BaseModel):
    drive_url: str
    note_id: str
    title: Optional[str] = None

class AddPDFResponse(BaseModel):
    success: bool
    note_id: str
    message: str

class AskQuestionRequest(BaseModel):
    question: str

class AskQuestionResponse(BaseModel):
    answer: str
    sources: list
    total_sources_found: int

class RemovePDFResponse(BaseModel):
    success: bool
    message: str

class StatsResponse(BaseModel):
    total_documents: int
    total_chunks: int
    status: str

# Health Check
@app.get("/")
async def root():
    return {"message": "Universal Notebook RAG API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "notebook-rag"}

# Add PDF to Knowledge Base
@app.post("/add-pdf", response_model=AddPDFResponse)
async def add_pdf_endpoint(request: AddPDFRequest):
    """Add a PDF from Google Drive to the universal knowledge base."""
    try:
        success = add_pdf(
            drive_url=request.drive_url,
            note_id=request.note_id,
            title=request.title
        )
        
        if success:
            return AddPDFResponse(
                success=True,
                note_id=request.note_id,
                message="PDF added to knowledge base successfully"
            )
        else:
            raise HTTPException(status_code=400, detail="Failed to add PDF")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Ask Question (Main Chat Feature)
@app.post("/ask", response_model=AskQuestionResponse)
async def ask_question_endpoint(request: AskQuestionRequest):
    """Ask a question to the universal knowledge base."""
    try:
        result = ask_question(request.question)
        
        return AskQuestionResponse(
            answer=result["answer"],
            sources=result["sources"],
            total_sources_found=result["total_sources_found"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Remove PDF from Knowledge Base
@app.delete("/remove-pdf/{note_id}", response_model=RemovePDFResponse)
async def remove_pdf_endpoint(note_id: str):
    """Remove a PDF from the knowledge base."""
    try:
        success = remove_pdf(note_id)
        
        if success:
            return RemovePDFResponse(
                success=True,
                message="PDF removed from knowledge base successfully"
            )
        else:
            raise HTTPException(
                status_code=404, 
                detail="Document not found in knowledge base"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get Knowledge Base Statistics
@app.get("/stats", response_model=StatsResponse)
async def get_stats_endpoint():
    """Get statistics about the knowledge base."""
    try:
        stats = get_stats()
        
        return StatsResponse(
            total_documents=stats["total_documents"],
            total_chunks=stats["total_chunks"],
            status=stats["status"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Debug endpoints
@app.get("/debug/search")
async def debug_search_endpoint(question: str, n_results: int = 20):
    """Debug what the semantic search is finding."""
    try:
        result = debug_search(question, n_results)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/debug/keyword")
async def debug_keyword_endpoint(keyword: str):
    """Search for chunks containing specific keywords."""
    try:
        result = search_keyword(keyword)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/debug/chunks")
async def debug_chunks_endpoint():
    """Get information about all chunks."""
    try:
        result = get_all_chunks()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask-debug")
async def ask_debug_endpoint(request: AskQuestionRequest):
    """Ask question with debug information."""
    try:
        result = ask_question_debug(request.question)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {"error": "Endpoint not found", "status_code": 404}

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return {"error": "Internal server error", "status_code": 500}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )