"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IndustrialLoader from "./PreLoader";

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {
  const canvasRef = useRef(null);
  const airpodsRef = useRef({ frame: 0 });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const frameCount = 250;
    const imageArray = [];

    const loadImages = async () => {
      for (let i = frameCount - 1; i >= 0; i--) {
        const img = new Image();
        img.src = `./alan/TDlandingPage${(i + 1)
          .toString()
          .padStart(4, "0")}.jpg`;

        await new Promise((resolve) => setTimeout(resolve, 5));

        imageArray.push(img);
        setLoadingProgress(Math.round(((frameCount - i) / frameCount) * 100));

        if (i === 0) {
          setLoading(false);
        }
      }
      setImages(imageArray);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const render = () => {
      if (!images[airpodsRef.current.frame]) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
    
      // Image Scaling
      const imageAspectRatio = 1980 / 1080;
      const imageScale = 1;
      let scaledWidth = window.innerWidth * imageScale;
      let scaledHeight = scaledWidth / imageAspectRatio;
    
      if (scaledHeight > window.innerHeight) {
        scaledHeight = window.innerHeight * imageScale;
        scaledWidth = scaledHeight * imageAspectRatio;
      }
    
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;
    
      context.drawImage(images[airpodsRef.current.frame], x, y, scaledWidth, scaledHeight);
    
      // Word-by-word sequence logic
      const frame = airpodsRef.current.frame;
      let textArray = [];
      if (frame >= 3 && frame <= 50) textArray = ["High", "Performance", "UI"];
      if (frame >= 105 && frame <= 150) textArray = ["Immersive", "3D", "Engine"];
      if (frame >= 200 && frame <= 280) textArray = ["Industrial", "AI", "Integration"];
    
      const wordSpacing = 220; // Spacing between words
      const baseX = canvas.width / 2 - (textArray.length * wordSpacing) / 2; // Center alignment
      const yPosition = canvas.height / 2;
    
      const visibleWordsCount = Math.floor((frame % 50) / 15); // Delayed word reveal
      const wordsToDisplay = textArray.slice(0, visibleWordsCount + 1);
    
      if (wordsToDisplay.length > 0) {
        context.save();
        context.font = "bold 72px 'Inter', sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
    
        wordsToDisplay.forEach((word, index) => {
          const isHighlighted = ["UI", "3D", "AI"].includes(word);
          context.fillStyle = isHighlighted ? "#ed5729" : "white";
          context.fillText(word, baseX + index * (wordSpacing + 120), yPosition);
        });
    
        context.restore();
      }
    };
    
    images[0].onload = render;

    gsap.to(airpodsRef.current, {
      frame: images.length - 1,
      snap: "frame",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "+=700",
        scrub: 4,
        pin: true,
      },
      onUpdate: render,
    });

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [images]);

  return (
    <main className="overflow-x-hidden">
      <div ref={containerRef} id="scroll-container" className="h-[100vh] relative">
        <div className="h-screen flex items-center justify-center bg-black sticky top-0 overflow-hidden">
          {loading && (
            <div className="w-screen h-screen absolute z-40 flex flex-col items-center justify-center text-white">
              <IndustrialLoader />
            </div>
          )}
          <canvas ref={canvasRef} className="z-0" />
        </div>
      </div>
    </main>
  );
};

export default ScrollAnimation;
