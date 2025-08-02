"use client";

import { Button } from "@heroui/react";
import { ArrowUp, User } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect, FormEvent } from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { gsap } from "gsap";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  sources?: Array<{
    title: string;
    page_number: number;
    content_preview: string;
    confidence: number;
    note_id: string;
    match_type: string;
  }>;
}

interface ApiResponse {
  answer: string;
  sources: Array<{
    title: string;
    page_number: number;
    content_preview: string;
    confidence: number;
    note_id: string;
    match_type: string;
  }>;
  total_sources_found: number;
}

const Page: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showImages, setShowImages] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // GSAP refs
  const limiBgRef = useRef<HTMLImageElement>(null);
  const limiProcRef = useRef<HTMLImageElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Initial animations on mount
  useEffect(() => {
    const tl = gsap.timeline();

    // Initial fade in for background image
    tl.fromTo(
      limiBgRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    )
      // Initial blur in for process image and slide up for input container (simultaneously)
      .fromTo(
        limiProcRef.current,
        {
          opacity: 0,
          filter: "blur(10px)",
          y: -20,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .fromTo(
        inputContainerRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "<" // Start at the same time as previous animation
      );
  }, []);

  // Animation for messages
  useEffect(() => {
    if (messages.length > 0) {
      const messageElements = document.querySelectorAll("[data-message-index]");
      const latestMessage = messageElements[messageElements.length - 1];

      if (latestMessage) {
        gsap.fromTo(
          latestMessage,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          }
        );
      }
    }
  }, [messages]);

  const fetchAnswerFromLimi = async (
    question: string
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch("/api/limi/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API call failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (showImages) {
        setShowImages(false);
        setIsTransitioning(true);

        // GSAP animation for transitioning images up
        gsap.to(imagesContainerRef.current, {
          y: "-100%",
          duration: 1,
          ease: "power2.inOut",
        });

        // Show messages container with animation
        if (messagesContainerRef.current) {
          gsap.set(messagesContainerRef.current, { display: "block" });
          gsap.fromTo(
            messagesContainerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.3 }
          );
        }
      }

      const userMessage: Message = {
        id: Date.now(),
        text: inputValue,
        sender: "user",
      };

      setMessages((prev) => [...prev, userMessage]);
      const currentQuestion = inputValue;
      setInputValue("");

      // Add shimmer placeholder
      const loadingMessage: Message = {
        id: Date.now() + 0.5,
        text: "Searching...",
        sender: "ai",
      };
      setMessages((prev) => [...prev, loadingMessage]);
      setIsLoading(true);

      try {
        const apiResponse = await fetchAnswerFromLimi(currentQuestion);

        const aiResponse: Message = {
          id: Date.now() + 1,
          text: apiResponse.answer,
          sender: "ai",
          sources: apiResponse.sources,
        };

        // Replace shimmer message with actual response
        setMessages((prev) => [...prev.slice(0, -1), aiResponse]);
      } catch (error) {
        console.error("API call failed:", error);

        const errorResponse: Message = {
          id: Date.now() + 1,
          text: "Sorry, I encountered an error while processing your request. Please try again.",
          sender: "ai",
        };

        // Replace shimmer message with error response
        setMessages((prev) => [...prev.slice(0, -1), errorResponse]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderSources = (sources?: Array<any>) => {
    if (!sources || sources.length === 0) return null;

    return (
      <div className="mt-3 p-3 bg-neutral-100 rounded-lg">
        <h4 className="text-xs font-semibold text-neutral-600 mb-2">
          Sources ({sources.length}):
        </h4>
        <div className="space-y-2">
          {sources.slice(0, 3).map((source, index) => (
            <div
              key={index}
              className="text-xs text-neutral-500 border-l-2 border-neutral-300 pl-2"
            >
              <div className="font-medium">
                {source.title} - Page {source.page_number}
              </div>
              <div className="truncate">{source.content_preview}</div>
              <div className="text-neutral-400">
                Confidence: {Math.round(source.confidence * 100)}% | Type:{" "}
                {source.match_type}
              </div>
            </div>
          ))}
          {sources.length > 3 && (
            <div className="text-xs text-neutral-400">
              +{sources.length - 3} more sources...
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Images that move up */}
      <div
        ref={imagesContainerRef}
        className="flex justify-center items-center h-1/2 relative"
      >
        <Image
          ref={limiBgRef}
          src="/limi-bg.png"
          alt="Limi Background"
          width={1080}
          height={695}
        />
        <Image
          ref={limiProcRef}
          className="absolute"
          src="/limi-proc.png"
          alt="Limi Process"
          width={755}
          height={275}
        />
      </div>

      {/* Chat Messages */}
      <div
        ref={messagesContainerRef}
        className="absolute top-0 left-0 right-0 bottom-52 overflow-y-auto p-6"
        style={{ display: isTransitioning ? "block" : "none" }}
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col justify-end min-h-full">
          <div className="space-y-4 mt-auto">
            {messages.map((message, index) => (
              <div
                key={message.id}
                data-message-index={index}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "flex-row-reverse self-end" : ""
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-400 flex items-center justify-center">
                  {message.sender === "user" ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="/limi-proc.png"
                        alt="limi avatar"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                </div>
                <div className="bg-[#D9D9D9] px-5 py-2 rounded-lg max-w-2xl">
                  {isLoading && message.text === "Searching..." ? (
                    <TextShimmer className="text-sm font-mono" duration={1.5}>
                      Searching...
                    </TextShimmer>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      {renderSources(message.sources)}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Field */}
      <div
        ref={inputContainerRef}
        className="absolute bg-white hover:bg-neutral-100 h-32 w-2/5 rounded-4xl left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-10 flex items-center px-6 border-3 border-neutral-300"
      >
        <form onSubmit={handleSubmit} className="flex-grow flex h-full">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything 'bout your notes ...."
            className="flex-grow bg-transparent border-0 outline-0 text-neutral-800 placeholder:text-neutral-400 text-lg resize-none h-full py-4"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as FormEvent);
              }
            }}
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="ml-4 p-2 bg-blue-700 rounded-lg text-white hover:bg-blue-800 transition self-end mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUp size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
