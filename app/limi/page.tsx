"use client";
import { Button } from "@heroui/react";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="h-screen relative">
      <div className="flex justify-center items-center h-1/2 relative">
        <Image
          src="/limi-bg.png"
          alt="Limi Process"
          width={1080}
          height={695}
        />
        <Image
          className="absolute "
          src="/limi-proc.png"
          alt="Limi Process"
          width={755}
          height={275}
        />
      </div>
      <div className="absolute bg-white hover:bg-neutral-100 h-32 w-2/5 rounded-4xl left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-10 flex items-center px-6 border-3 border-neutral-300">
        <textarea
          placeholder="Ask me anything 'bout your notes ...."
          className="flex-grow bg-transparent border-0 outline-0 text-neutral-800 placeholder:text-neutral-400 text-lg resize-none h-full py-4"
        />
        <Button
          type="submit"
          className="ml-4 p-2 bg-blue-700 rounded-lg text-white hover:bg-blue-800 transition"
        >
          <ArrowUp size={20} />
        </Button>
      </div>
    </div>
  );
};

export default page;
