"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const lastFrameIndex = useRef(0);
  const scrollDirection = useRef('forward');
  const totalLoaded = useRef(0);

  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Simple function to draw an image to the canvas
  const drawImage = (index) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Find the closest loaded image if this one isn't available
    if (!imageCache.current[index]) {
      // Find nearest available frame
      let nearestIndex = null;
      let minDistance = Infinity;
      
      for (let i = 0; i < imageCache.current.length; i++) {
        if (imageCache.current[i]) {
          const distance = Math.abs(i - index);
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = i;
          }
        }
      }
      
      // Draw the nearest frame if found
      if (nearestIndex !== null && imageCache.current[nearestIndex]) {
        ctx.drawImage(
          imageCache.current[nearestIndex],
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    } else {
      // Draw the exact frame
      ctx.drawImage(
        imageCache.current[index],
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  // Title animation function
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

  // Image preloading effect - completely rewritten for reliability
  useEffect(() => {
    let isMounted = true;
    
    // Simple method to safely update progress
    const updateProgress = (loaded) => {
      if (!isMounted) return;
      const percentage = Math.min(100, Math.floor((loaded / totalFrames) * 100));
      setProgress(percentage);
    };

    // Preload all images in smaller batches
    const preloadImages = async () => {
      // Display first frame immediately
      const initialImg = new Image();
      initialImg.crossOrigin = "anonymous";
      initialImg.src = `/ImageSequence/desktop/TDlandingPage0001.jpg`;
      
      initialImg.onload = () => {
        imageCache.current[0] = initialImg;
        if (canvasRef.current) {
          drawImage(0);
        }
        totalLoaded.current = 1;
        updateProgress(1);
      };

      try {
        // Load in small batches of sequential frames for reliable progress updates
        const batchSize = 10;
        for (let startFrame = 1; startFrame <= totalFrames; startFrame += batchSize) {
          const endFrame = Math.min(startFrame + batchSize - 1, totalFrames);
          const framesToLoad = [];
          
          for (let i = startFrame; i <= endFrame; i++) {
            framesToLoad.push(i);
          }
          
          await loadFrameBatch(framesToLoad);
          
          // Allow early start after 25% loaded
          if (totalLoaded.current >= totalFrames * 0.25 && loading && isMounted) {
            console.log("Enough frames loaded, can start animation");
          }
        }
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading images:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Load a batch of frames and update progress
    const loadFrameBatch = (frameIndices) => {
      return new Promise((resolve) => {
        let completed = 0;
        const total = frameIndices.length;
        
        // For empty batch, resolve immediately
        if (total === 0) {
          resolve();
          return;
        }
        
        frameIndices.forEach((frameNum) => {
          // Skip already loaded frames
          if (imageCache.current[frameNum - 1]) {
            completed++;
            if (completed === total) resolve();
            return;
          }
          
          const img = new Image();
          img.crossOrigin = "anonymous";
          const paddedIndex = frameNum.toString().padStart(4, "0");
          img.src = `/ImageSequence/desktop/TDlandingPage${paddedIndex}.jpg`;
          
          img.onload = () => {
            if (!isMounted) return;
            
            imageCache.current[frameNum - 1] = img;
            totalLoaded.current++;
            updateProgress(totalLoaded.current);
            
            completed++;
            if (completed === total) resolve();
          };
          
          img.onerror = () => {
            completed++;
            console.error(`Failed to load image ${frameNum}`);
            if (completed === total) resolve();
          };
        });
      });
    };

    preloadImages();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // ScrollTrigger setup effect
  useEffect(() => {
    if (loading) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      onUpdate: (self) => {
        scrollDirection.current = self.direction > 0 ? 'forward' : 'backward';
        
        // Calculate current frame based on scroll position
        const scrollProgress = self.progress;
        let frameIndex = Math.min(
          totalFrames - 1,
          Math.floor(scrollProgress * totalFrames)
        );
        
        // Prevent jumping backward unless intentionally scrolling backward
        if (scrollDirection.current === 'forward' && frameIndex < lastFrameIndex.current) {
          frameIndex = lastFrameIndex.current;
        }
        
        lastFrameIndex.current = frameIndex;
        drawImage(frameIndex);
        
        // Update visible title
        const titleIndex = Math.floor(scrollProgress * titles.length);
        if (titleIndex !== currentTitleRef.current) {
          if (currentTitleRef.current !== -1) {
            animateTitle(currentTitleRef.current, false);
          }
          animateTitle(titleIndex, true);
          currentTitleRef.current = titleIndex;
        }
      }
    });

    return () => {
      scrollTrigger.kill();
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
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-white text-xl mt-2">{progress}%</div>
          
          {progress >= 25 && (
            <button 
              onClick={() => setLoading(false)}
              className="mt-6 px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              Start Now ({progress}% loaded)
            </button>
          )}
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
            className="absolute top-1/4 left-0 right-0 px-4 sm:px-8 md:px-12 text-center opacity-0 flex flex-col items-center gap-2 sm:gap-4"
          >
           <div className="text-6xl font-bold text-white first-line">{title.firstLine}</div>
            <div className="text-6xl font-bold text-orange-600 highlight">
              {title.highlight}
              <span className="text-6xl font-bold text-white">{title.secondLine}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionedImageScroller;