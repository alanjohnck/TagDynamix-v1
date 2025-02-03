"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function CompanyHero() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const subtitleRef = useRef(null);

  const words = [
    { text: "Dynamic", color: "#60A5FA" },
    { text: "Visualization", color: "#F87171" },
    { text: "Debugging", color: "#06B6D4" },
    { text: "Industrial AI", color: "#D946EF" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(subtitleRef.current, { opacity: 0, y: 40 });
      
      gsap.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
      });

      const wordElements = words.map((word, index) => {
        const element = document.createElement("span");
        element.textContent = word.text;
        element.style.color = word.color;
        element.style.position = "absolute";
        element.style.opacity = index === 0 ? 1 : 0;
        element.style.width = "100%";
        element.style.textAlign = "left";
        element.style.left = "0";
        element.style.top = "50%";
        element.style.transform = `translateY(-50%) scale(${index === 0 ? 1 : 0.8})`;
        element.style.transformOrigin = "left center";
        containerRef.current.appendChild(element);
        return element;
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          snap: 1 / (words.length - 1),
        },
      });

      wordElements.forEach((el, index) => {
        if (index < wordElements.length - 1) {
          tl.to(el, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.out",
          })
          .fromTo(wordElements[index + 1], 
            {
              opacity: 0,
              scale: 0.8,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              ease: "power2.in",
            },
            "<"
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />
      <div className="h-full flex items-center justify-center px-4">
        <div className="text-center flex flex-col items-center gap-6">
          <div className="text-4xl md:text-7xl font-bold text-white flex items-center gap-4">
            <span>Your</span>
            <span
              ref={containerRef}
              className="relative inline-block w-[250px] md:w-[500px] h-[1em] md:h-[1.3em] text-4xl md:text-7xl"
            />
          </div>
          <h2 
            ref={subtitleRef} 
            className="text-4xl md:text-7xl font-bold text-white"
          >
            Technology Partner
          </h2>
        </div>
      </div>
    </section>
  );
}

export default CompanyHero;