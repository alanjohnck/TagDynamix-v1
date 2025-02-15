"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const SectionedImageScroller = () => {
  const totalFrames = 279;
  const titles = [
    { title: "High performance", highlight: "UI" },
    { title: "Seamless", highlight: "Integration" },
    { title: "Smart", highlight: "Automation" },
  ];

  const [loading, setLoading] = useState(true);
  const imageCache = useRef([]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null); // Reference to the container div

  useEffect(() => {
    const preloadImages = async () => {
      try {
        const loadImage = (index) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = `/ImageSequence/desktop/TDlandingPage${index
              .toString()
              .padStart(4, "0")}.jpg`;
            img.onload = () => {
              imageCache.current[index - 1] = img;
              resolve();
            };
            img.onerror = reject;
          });
        };

        const chunkSize = 10;
        for (let i = 1; i <= totalFrames; i += chunkSize) {
          const chunk = [];
          for (let j = 0; j < chunkSize && i + j <= totalFrames; j++) {
            chunk.push(loadImage(i + j));
          }
          await Promise.all(chunk);
        }

        setLoading(false);
        drawImage(0);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    preloadImages();
  }, []);

  const drawImage = (index) => {
    if (!canvasRef.current || !imageCache.current[index]) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      imageCache.current[index],
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  useEffect(() => {
    if (loading) return;

    const updateOnScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      // Calculate scroll relative to container
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const scrollTop = window.scrollY;
      const scrollPosition = scrollTop - containerTop;
      const maxScroll = containerHeight - window.innerHeight;
      let scrollFraction = scrollPosition / maxScroll;

      // Clamp scroll fraction between 0 and 1
      scrollFraction = Math.max(0, Math.min(1, scrollFraction));

      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(scrollFraction * totalFrames)
      );

      drawImage(frameIndex);

      // Update titles based on scroll progress
      const wordIndex = Math.floor(scrollFraction * titles.length) ;

      titles.forEach((_, index) => {
        const textElement = document.getElementById(`text-${index}`);
        if (textElement) {
          gsap.to(textElement, {
            opacity: wordIndex === index ? 1 : 0,
            y: wordIndex === index ? 0 : 50,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
    };

    window.addEventListener("scroll", updateOnScroll);
    return () => window.removeEventListener("scroll", updateOnScroll);
  }, [loading]);

  return (
    <div className="h-[600vh]" ref={containerRef}>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <div className="text-white text-3xl font-bold">Loading...</div>
        </div>
      )}

      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex justify-center items-center bg-black">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />

        {titles.map((title, index) => (
          <div
            key={index}
            id={`text-${index}`}
            className="absolute top-[20%] left-0 right-0 px-12 text-center opacity-0"
          >
            <h1 className="text-7xl font-bold text-white mb-4">
              {title.title}{" "}
              <span className="text-orange-600">{title.highlight}</span>
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionedImageScroller;