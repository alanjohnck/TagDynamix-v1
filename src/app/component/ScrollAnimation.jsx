"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {
  const canvasRef = useRef(null);
  const airpodsRef = useRef({ frame: 0 });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const frameCount = 250;
    const imageArray = [];
  
    const loadImages = async () => {
      for (let i = frameCount - 1; i >= 0; i--) {
        const img = new Image();
        img.src = `./alan/finalanimation${(i + 1)
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
    
      // Draw image with previous scaling logic
      const imageAspectRatio = 1980 / 1080;
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
    
      // Enhanced Text Rendering
      const texts = [
        "High Performance UI", 
        "Immersive 3D Engine", 
        "Industrial AI Integration"
      ];
    
      // Calculate progress and current text index
      const progress = airpodsRef.current.frame / images.length;
      const textIndex = Math.floor(progress * texts.length);
      
      // Advanced Text Styling
      context.save();
      context.font = "bold 72px 'Inter', sans-serif"; // Modern font
      context.textAlign = "center";
      context.textBaseline = "middle";
    
      // Gradient Text Effect
      const gradient = context.createLinearGradient(
        0, canvas.height/2 - 50, 
        0, canvas.height/2 + 50
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.8)");
      gradient.addColorStop(0.5, "rgba(135,206,235,0.9)"); // Skyblue with transparency
      gradient.addColorStop(1, "rgba(255,255,255,0.8)");
    
      context.fillStyle = gradient;
    
      // Dynamic Text Animation
      const textOpacity = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
      context.globalAlpha = textOpacity;
    
      // Add subtle text shadow for depth
      context.shadowColor = 'rgba(0,0,0,0.5)';
      context.shadowBlur = 10;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
    
      // Draw text with perspective and scaling
      const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
      context.translate(canvas.width / 2, canvas.height / 2);
      context.scale(scale, scale);
      context.fillText(texts[textIndex], 0, 0);
    
      context.restore();
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
      <div id="scroll-container" className="h-[100vh] relative">
        <div className="h-screen flex items-center justify-center bg-black sticky top-0 overflow-hidden">
          {loading && (
            <div className="w-screen h-screen absolute z-20 flex flex-col items-center justify-center text-white">
              <div className="text-2xl mb-4">Loading images...</div>
              <div className="text-xl">{loadingProgress}%</div>
            </div>
          )}
          <canvas ref={canvasRef} className=" z-0" />
          
          {/* Animated Text Elements - Centered */}
      
        </div>
      </div>
    </main>
  );
};

export default ScrollAnimation;
