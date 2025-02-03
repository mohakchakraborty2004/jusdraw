"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BackgroundBeamsDemo() {
  const router = useRouter();
  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4 flex flex-col ">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          JUSdraw
        </h1>
        
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm justify-center items-center text-center relative z-10">
        Welcome to JusDraw, where creativity flows... but sometimes gets distracted by shiny things. 
        This app is a canvas full of potential—kind of like that unfinished sketch you left in your
        notebook. You can draw, you can doodle, but don’t be too surprised if some features are still
        waiting to be "finished" like that last pizza slice you promised yourself to eat... tomorrow.
        So, dive in, add your strokes of genius, and remember—perfection is overrated. After all,
        it’s JusDraw, not JustFinished. 😎🎨
        </p>

        <Link href="/canvas" className="z-20">
       <button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 z-10 ml-[13.2rem]">
         Canvas
       </button>
   </Link>
      

      </div>
      <BackgroundBeams />
    </div>
  );
}

