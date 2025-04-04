import { TextHoverEffect } from "./ui/text-hover-effect";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white w-screen min-h-screen flex flex-col justify-center ">
      {/* Main content area */}
      <div className="container mx-auto px-4 h-3/4">
        {/* Top branding */}
        <div className="pt-8 items-center flex justify-center">
          <img src="./logo.svg" className=" w-25 h-20 -translate-x-[43.5%] md:-translate-x-[75.5%]" alt="Logo" />
        </div>

        {/* Text wrapper with relative positioning */}
        <div className="relative mt-2 text-center">
          {/* Unlock text container */}
          <div className="relative inline-flex w-full h-40 text-center">
            <TextHoverEffect text="Unlock" />
            {/* Possibilities positioned absolutely relative to Unlock */}
            <h2
              className="absolute text-[2rem] sm:text-7xl md:text-7xl lg:text-7xl text-white font-bold whitespace-nowrap"
              style={{
                left: "41.5%", // Aligns with 'n' of Unlock
                bottom: "-0.7em", // Adjust vertical position
                transform: "translateX(-14%)", // Fine-tune alignment
              }}
            >
              Possibilities
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-32 border-t border-purple-900">
        <nav className="flex justify-center gap-8 py-4">
          <Link href="/Company" className="text-white hover:text-gray-300">
            Company
          </Link>
          <Link href="/Pricing" className="text-white hover:text-gray-300">
            Pricing
          </Link>
          <Link href="/Contact" className="text-white hover:text-gray-300">
            Contact
          </Link>
        </nav>
      </div>

      {/* Bottom branding and copyright */}
      <div className="mt-8 pb-8 text-center h-1/4">
        {/* <div className="flex items-center justify-start">
          <span className="text-white text-sm">Tag Dynamix</span>
        </div> */}
        <div className="mt-2">
          <p className="text-gray-500 text-xs">© 2024 Tag Dynamix. All rights reserved.</p>
          <p className="text-gray-500 text-xs mt-1">
            Tag Dynamix is a registered trademark of Tag Dynamix. Third party trademarks are the property of their
            respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}