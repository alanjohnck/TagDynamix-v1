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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateDeviceType = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", updateDeviceType);
    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  useEffect(() => {
    const frameCount = 280;
    const imageArray = [];
    const imagePrefix = isMobile ? "mobile" : "desktop"; // Choose image type

    const loadImages = async () => {
      for (let i = 1; i < frameCount - 1; i++) {
        const img = new Image();
        img.src = `./ImageSequence/${imagePrefix}/TDlandingPage${(i + 1)
          .toString()
          .padStart(4, "0")}.jpg`;

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        imageArray.push(img);
        setLoadingProgress(Math.round(((i + 1) / frameCount) * 100)); // Update progress correctly
        if (i === frameCount - 2) {
          setLoading(false);
        }
      }
      setImages(imageArray);
    };

    loadImages();
  }, [isMobile]);

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
      const imageAspectRatio = isMobile ? 1080 / 1920 : 1980 / 1080; // Adjust based on mobile or desktop
      const imageScale = 1.15;
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
      if (frame >= 200 && frame <= 250) textArray = ["Industrial", "AI", "Integration"];
    
      const wordSpacing = isMobile ? 0 : 350; // No horizontal spacing for mobile
      const baseX = canvas.width / 2 -(isMobile?0:250); // Center the words horizontally
      const yPosition = canvas.height / 2 - (isMobile ? 150 : 200); // Adjust text position
    
      // For mobile, stack the words vertically
      let visibleWordsCount = Math.floor((frame % 50) / 15);
      let wordsToDisplay = textArray.slice(0, visibleWordsCount + 1);
    
      if (isMobile) {
        wordsToDisplay.forEach((word, index) => {
          const isHighlighted = ["UI", "3D", "AI"].includes(word);
          context.save();
          context.font = `bold 36px 'Inter', sans-serif`;
          context.fillStyle = isHighlighted ? "#ed5729" : "white";
          context.textAlign = "center";
          context.textBaseline = "top";
          context.fillText(word, baseX, yPosition + index * 50); // Vertical stacking of words in mobile
          context.restore();
        });
      } else {
        // For desktop, display words horizontally in one line
        wordsToDisplay.forEach((word, index) => {
          const isHighlighted = ["UI", "3D", "AI"].includes(word);
          context.save();
          context.font = `bold 72px 'Inter', sans-serif`;
          context.fillStyle = isHighlighted ? "#ed5729" : "white";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(word, baseX + index * wordSpacing, yPosition); // Horizontal arrangement for desktop
          context.restore();
        });
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
        end: "+=600",
        scrub: 6,
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
          {loadingProgress < 100 && (
            <div className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
              {loadingProgress}%
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ScrollAnimation;
