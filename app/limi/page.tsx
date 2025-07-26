"use client";

import { Button } from "@heroui/react";
import { ArrowUp, User } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect, FormEvent } from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const Page: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showImages, setShowImages] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (showImages) {
        setShowImages(false);
        setIsTransitioning(true);
      }

      const userMessage: Message = {
        id: Date.now(),
        text: inputValue,
        sender: "user",
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");

      // Add shimmer placeholder
      const loadingMessage: Message = {
        id: Date.now() + 0.5,
        text: "Searching...",
        sender: "ai",
      };
      setMessages((prev) => [...prev, loadingMessage]);
      setIsLoading(true);

      // Simulate delay
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: "Thanks for your message! This is a simulated AI response.",
          sender: "ai",
        };
        // Replace shimmer message with actual response
        setMessages((prev) => [...prev.slice(0, -1), aiResponse]);
        setIsLoading(false);
      }, 5000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen relative overflow-hidden">
      <style jsx>{`
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Images that move up */}
      <div
        className={`flex justify-center items-center h-1/2 relative transition-all duration-1000 ease-in ${
          isTransitioning ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <Image
          src="/limi-bg.png"
          alt="Limi Background"
          width={1080}
          height={695}
          className="transition-all duration-1000 ease-in"
        />
        <Image
          className="absolute transition-all duration-1000 ease-in"
          src="/limi-proc.png"
          alt="Limi Process"
          width={755}
          height={275}
        />
      </div>

      {/* Chat Messages */}
      {isTransitioning && (
        <div className="absolute top-0 left-0 right-0 bottom-52 overflow-y-auto p-6">
          <div className="w-full max-w-2xl mx-auto flex flex-col justify-end min-h-full">
            <div className="space-y-4 mt-auto">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === "user" ? "flex-row-reverse self-end" : ""
                  }`}
                  style={{
                    animation: `slideInFromBottom 0.5s ease-out forwards`,
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                  }}
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
                  <div className="bg-[#D9D9D9] text-center px-5 py-2 rounded-lg max-w-md">
                    {isLoading && message.text === "Searching..." ? (
                      <TextShimmer className="text-sm font-mono" duration={1.5}>
                        Searching...
                      </TextShimmer>
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Input Field */}
      <div className="absolute bg-white hover:bg-neutral-100 h-32 w-2/5 rounded-4xl left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-10 flex items-center px-6 border-3 border-neutral-300">
        <form onSubmit={handleSubmit} className="flex-grow flex h-full">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything 'bout your notes ...."
            className="flex-grow bg-transparent border-0 outline-0 text-neutral-800 placeholder:text-neutral-400 text-lg resize-none h-full py-4"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as FormEvent);
              }
            }}
          />
          <Button
            type="submit"
            className="ml-4 p-2 bg-blue-700 rounded-lg text-white hover:bg-blue-800 transition self-end mb-4"
          >
            <ArrowUp size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
