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
  const [loadedFrames, setLoadedFrames] = useState(0);
  const imageCache = useRef([]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationsRef = useRef({});
  const currentTitleRef = useRef(-1);
  const lastFrameIndex = useRef(0);
  const scrollDirection = useRef('forward');
  const progressUpdateTimerRef = useRef(null);

  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    return () => {
      if (progressUpdateTimerRef.current) {
        clearTimeout(progressUpdateTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateProgressSmoothly = (value) => {
      // Ensure progress never decreases during loading
      setProgress(prev => Math.max(prev, value));
    };

    const preloadImages = async () => {
      try {
        // Create a low-resolution initial frame for immediate display
        const initialImg = new Image();
        initialImg.crossOrigin = "anonymous";
        initialImg.src = `/ImageSequence/desktop/TDlandingPage0001.jpg`;
        initialImg.onload = () => {
          imageCache.current[0] = initialImg;
          drawImage(0);
        };

        // Load images in smaller chunks with priority for keyframes
        const keyFrames = [1]; // Start with first frame
        for (let i = 0; i < titles.length; i++) {
          // Add frames at section transitions as key frames
          keyFrames.push(Math.floor((i / titles.length) * totalFrames));
          keyFrames.push(Math.floor(((i + 1) / titles.length) * totalFrames) - 1);
        }
        keyFrames.push(totalFrames - 1); // End with last frame
        
        // Remove duplicates and sort
        const uniqueKeyFrames = [...new Set(keyFrames)].sort((a, b) => a - b);
        
        // Load key frames first
        await loadFrames(uniqueKeyFrames);
        
        // Then load the rest in smaller chunks and in background
        const remainingFrames = Array.from(
          { length: totalFrames }, 
          (_, i) => i + 1
        ).filter(i => !uniqueKeyFrames.includes(i));
        
        const chunkSize = 20; // Smaller chunks for more frequent progress updates
        for (let i = 0; i < remainingFrames.length; i += chunkSize) {
          const chunk = remainingFrames.slice(i, i + chunkSize);
          // Use lower priority for remaining frames
          await loadFrames(chunk, false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading images:", error);
        setLoading(false); // Still allow user to view partially loaded animation
      }
    };

    const loadFrames = async (frameIndices, isKeyFrame = true) => {
      return new Promise((resolve) => {
        let completed = 0;
        
        frameIndices.forEach((index) => {
          if (imageCache.current[index - 1]) {
            completed++;
            if (completed === frameIndices.length) resolve();
            return;
          }
          
          const img = new Image();
          img.crossOrigin = "anonymous";
          
          // Use a smaller resolution while loading for faster initial preview
          if (!isKeyFrame && loading) {
            img.src = `/ImageSequence/desktop/TDlandingPage${index.toString().padStart(4, "0")}.jpg?quality=60`;
          } else {
            img.src = `/ImageSequence/desktop/TDlandingPage${index.toString().padStart(4, "0")}.jpg`;
          }
          
          img.onload = () => {
            imageCache.current[index - 1] = img;
            completed++;
            setLoadedFrames(prev => prev + 1);
            
            // Update progress smoothly
            const newProgress = ((loadedFrames + 1) / totalFrames * 100).toFixed(0);
            updateProgressSmoothly(newProgress);
            
            if (completed === frameIndices.length) resolve();
            
            // If we've loaded enough frames to start, allow interaction
            if (loadedFrames > totalFrames * 0.2 && loading) {
              setLoading(false);
            }
          };
          
          img.onerror = () => {
            completed++;
            console.error(`Failed to load image ${index}`);
            if (completed === frameIndices.length) resolve();
          };
        });
      });
    };

    preloadImages();
  }, []);

  const drawImage = (index) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // If the exact frame isn't loaded yet, find the nearest available frame
    if (!imageCache.current[index]) {
      let nearestIndex = null;
      let minDistance = totalFrames;
      
      for (let i = 0; i < imageCache.current.length; i++) {
        if (imageCache.current[i]) {
          const distance = Math.abs(i - index);
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = i;
          }
        }
      }
      
      if (nearestIndex !== null) {
        ctx.drawImage(
          imageCache.current[nearestIndex],
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    } else {
      ctx.drawImage(
        imageCache.current[index],
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
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

    // Create a ScrollTrigger for smoother scrolling
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5, // Smoother scrubbing effect
      onUpdate: (self) => {
        // Determine scroll direction
        const newDirection = self.direction > 0 ? 'forward' : 'backward';
        scrollDirection.current = newDirection;
        
        // Calculate the frame index based on scroll progress
        const progress = self.progress;
        let frameIndex = Math.min(
          totalFrames - 1,
          Math.floor(progress * totalFrames)
        );
        
        // Prevent frame index from going backwards unless actually scrolling backward
        if (newDirection === 'forward' && frameIndex < lastFrameIndex.current) {
          frameIndex = lastFrameIndex.current;
        }
        
        // Update the last frame index
        lastFrameIndex.current = frameIndex;
        
        // Draw the current frame
        requestAnimationFrame(() => drawImage(frameIndex));
        
        // Calculate which title should be shown
        const titleIndex = Math.floor(progress * titles.length);
        
        if (titleIndex !== currentTitleRef.current) {
          if (currentTitleRef.current !== -1) {
            animateTitle(currentTitleRef.current, false);
          }
          
          animateTitle(titleIndex, true);
          currentTitleRef.current = titleIndex;
        }
      }
    });

    // Continue loading remaining frames in background even after initial display
    const loadRemainingFrames = async () => {
      // Find missing frames
      const missingFrames = [];
      for (let i = 0; i < totalFrames; i++) {
        if (!imageCache.current[i]) {
          missingFrames.push(i + 1);
        }
      }
      
      if (missingFrames.length > 0) {
        const chunkSize = 10;
        for (let i = 0; i < missingFrames.length; i += chunkSize) {
          const chunk = missingFrames.slice(i, i + chunkSize);
          await new Promise(resolve => {
            setTimeout(async () => {
              try {
                await Promise.all(chunk.map(index => {
                  return new Promise((res) => {
                    if (imageCache.current[index - 1]) {
                      res();
                      return;
                    }
                    
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.src = `/ImageSequence/desktop/TDlandingPage${index.toString().padStart(4, "0")}.jpg`;
                    img.onload = () => {
                      imageCache.current[index - 1] = img;
                      res();
                    };
                    img.onerror = res;
                  });
                }));
              } catch (error) {
                console.error("Error loading remaining images:", error);
              }
              resolve();
            }, 100); // Small delay to prevent browser from freezing
          });
        }
      }
    };
    
    loadRemainingFrames();

    return () => {
      // Clean up ScrollTrigger
      scrollTrigger.kill();
      
      // Clean up GSAP animations
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
          {progress > 20 && (
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
              {title.highlight} <t />
              <span className="text-6xl font-bold text-white">{title.secondLine}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionedImageScroller;