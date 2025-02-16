"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const SectionedImageScroller = () => {
  const totalFrames = 279;
  const titles = [
    { 
      firstLine: "High performance",
      highlight: "HMI & SCADA",
      secondLine: "solutions"
    },
    { 
      firstLine: "Immersive",
      highlight: "3D",
      secondLine: "Engine Visualization"
    },
    { 
      firstLine: "Industrial",
      highlight: "AI",
      secondLine: "Integration"
    },
  ];

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const imageCache = useRef([]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationsRef = useRef({});
  const currentTitleRef = useRef(-1);

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
              setProgress(((index / totalFrames) * 100).toFixed(0));
              resolve();
            };
            img.onerror = reject;
          });
        };

        const chunkSize = 40;
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

  const animateTitle = (index, show) => {
    const textContainer = document.querySelector(`#text-${index}`);
    if (!textContainer) return;

    if (animationsRef.current[index]) {
      animationsRef.current[index].forEach(tween => tween.kill());
    }
    animationsRef.current[index] = [];

    const firstLine = textContainer.querySelector('.first-line');
    const highlight = textContainer.querySelector('.highlight');
    const secondLine = textContainer.querySelector('.second-line');
    
    animationsRef.current[index].push(
      gsap.to(textContainer, {
        opacity: show ? 1 : 0,
        duration: show ? 0.5 : 0.3,
        ease: show ? "power2.out" : "power2.in"
      })
    );

    // Animate each line separately with progressive delays
    if (show) {
      gsap.fromTo(firstLine, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
      );
      
      gsap.fromTo(highlight,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: "power2.out" }
      );
      
      gsap.fromTo(secondLine,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: "power2.out" }
      );
    } else {
      gsap.to([firstLine, highlight, secondLine], {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  };

  useEffect(() => {
    if (loading) return;

    let scrollTimeout;
    const updateOnScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }

      scrollTimeout = window.requestAnimationFrame(() => {
        const containerTop = container.offsetTop;
        const containerHeight = container.offsetHeight;
        const scrollTop = window.scrollY;
        const scrollPosition = scrollTop - containerTop;
        const maxScroll = containerHeight - window.innerHeight;
        let scrollFraction = scrollPosition / maxScroll;
        scrollFraction = Math.max(0, Math.min(1, scrollFraction));

        const frameIndex = Math.min(
          totalFrames - 1,
          Math.floor(scrollFraction * totalFrames)
        );

        drawImage(frameIndex);

        const titleIndex = Math.floor(scrollFraction * titles.length);
        
        if (titleIndex !== currentTitleRef.current) {
          if (currentTitleRef.current !== -1) {
            animateTitle(currentTitleRef.current, false);
          }
          
          animateTitle(titleIndex, true);
          
          currentTitleRef.current = titleIndex;
        }
      });
    };

    window.addEventListener("scroll", updateOnScroll);
    updateOnScroll();
    
    return () => {
      window.removeEventListener("scroll", updateOnScroll);
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      Object.values(animationsRef.current).forEach(animations => {
        animations.forEach(tween => tween.kill());
      });
    };
  }, [loading]);

  return (
    <div className="h-[600vh]" ref={containerRef}>
      {loading && (
        <div className="fixed top-0 inset-0 flex flex-col items-center justify-center bg-black z-50">
          <div className="text-white text-3xl font-bold mb-4">Loading...</div>
          <div className="w-1/2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-white text-xl mt-2">{progress}%</div>
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
            className="absolute top-[5.5rem] left-0 right-0 px-12 text-center opacity-0 flex flex-col items-center gap-4"
          >
            <div className="text-6xl font-bold text-white first-line">
              {title.firstLine}
            </div>
            <div className="text-6xl font-bold text-orange-600 highlight">
              {title.highlight} <t />
              <span className="text-6xl  font-bold text-white">{title.secondLine}</span>
            </div>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionedImageScroller;