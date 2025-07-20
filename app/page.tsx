import React from "react";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100">
      <div className="text-center">
        <div className="flex ">
          <div
            style={{ fontFamily: "FreightDispPro, serif" }}
            className="text-5xl italic text-[#3d3d3d]"
          >
            .deadcatsociety
          </div>
          <div className="mt-[-16px]">
            <Image
              unoptimized={true}
              src="/sleeping_cat.gif"
              alt="the gif"
              height={64}
              width={64}
            />
          </div>
        </div>

        <div className="font-sans font-medium  text-[#3d3d3d] mt-2">
          <TextEffect preset="fade-in-blur" speedReveal={1} speedSegment={0.5}>
            Study Logs for the Terminally Curious
          </TextEffect>
        </div>
      </div>
    </main>
  );
}
