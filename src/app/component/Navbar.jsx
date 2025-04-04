"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 0) {
        setShowNavbar(false); // Hide navbar on scroll down
      } else {
        setShowNavbar(true); // Show navbar on scroll up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 transition-transform duration-500 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-[95%] mx-auto bg-black mt-4 p-4 rounded-lg flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex-shrink-0 flex-1">
          <Link href="/">
            <img src="./logo.svg" className="h-22 w-16 cursor-pointer" alt="Logo" />
          </Link>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex flex-2 px-25 justify-center space-x-8 text-white text-lg font-medium">
          <Link href="/Company" className="hover:text-gray-300 transition-colors">
            Company
          </Link>
          <Link href="/Pricing" className="hover:text-gray-300 transition-colors">
            Pricing
          </Link>
          <Link href="/Contact" className="hover:text-gray-300 transition-colors">
            Contact
          </Link>
        </div>

        {/* Request Demo Button */}
        <div className="hidden md:flex flex-1 justify-end">
          <Link href="/Contact">
            <button className="bg-white text-black px-5 py-2 rounded-md hover:bg-gray-200 transition-all">
              Request a Demo
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black rounded-lg p-4 mx-4 mt-2 flex flex-col space-y-4">
          <Link href="/Company" className="text-white text-lg hover:text-gray-300">
            Company
          </Link>
          <Link href="/Pricing" className="text-white text-lg hover:text-gray-300">
            Pricing
          </Link>
          <Link href="/Contact" className="text-white text-lg hover:text-gray-300">
            Contact
          </Link>
          <Link href="/Contact">
            <button className="w-full bg-white text-black px-5 py-2 rounded-md hover:bg-gray-200 transition-all">
              Request a Demo
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
