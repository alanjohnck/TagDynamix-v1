"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SectionedImageScroller = () => {
  const totalFrames = 279;
  const titles = [
    { 
      firstLine: "High Performance",
      highlight: "HMI & SCADA",
      secondLine: "Solutions"
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
  const [loadedImages, setLoadedImages] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const imageCache = useRef([]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationsRef = useRef({});
  const currentTitleRef = useRef(-1);
  const lastFrameIndex = useRef(0);
  const scrollDirection = useRef('forward');
  const loadingTimeoutRef = useRef(null);

  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    // Initialize and prep canvas even before images load
    if (canvasRef.current) {
      // Set canvas size optimization
      const ctx = canvasRef.current.getContext("2d", { alpha: false });
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium"; // Balance between quality and performance
    }
    
    // Set a timeout to ensure loading doesn't get stuck forever
    loadingTimeoutRef.current = setTimeout(() => {
      if (loading && loadedImages > 0) {
        console.log("Loading timeout reached, allowing partial scroll");
        setCanScroll(true);
        if (loadedImages > totalFrames * 0.25) {
          setLoading(false);
        }
      }
    }, 15000); // 15 seconds timeout

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [loading, loadedImages]);

  useEffect(() => {
    const preloadImages = async () => {
      try {
        // Preload low resolution images first for initial display
        await preloadKeyFrames();
        
        // Set can scroll once key frames are loaded
        setCanScroll(true);
        
        // Then load all images in parallel with optimized strategy
        await loadAllImages();
        
        setLoading(false);
        drawImage(0);
      } catch (error) {
        console.error("Error loading images:", error);
        // If error occurs but we have some images, allow viewing
        if (loadedImages > 0) {
          setLoading(false);
          setCanScroll(true);
        }
      }
    };

    const preloadKeyFrames = async () => {
      // Load key frames first (start of each section + some extras)
      const framesPerSection = Math.floor(totalFrames / titles.length);
      const keyFrames = [];
      
      titles.forEach((_, i) => {
        const sectionStart = i * framesPerSection;
        keyFrames.push(sectionStart + 1);
        // Also add one frame in the middle of each section
        keyFrames.push(Math.min(sectionStart + Math.floor(framesPerSection/2), totalFrames));
      });
      
      // Add last frame
      keyFrames.push(totalFrames);
      
      // Remove duplicates
      const uniqueKeyFrames = [...new Set(keyFrames)].filter(f => f <= totalFrames);
      
      // Load key frames with higher priority
      await Promise.all(uniqueKeyFrames.map(loadImage));
    };

    const loadAllImages = async () => {
      // Use a more efficient loading strategy with progressive enhancement
      try {
        // Create array of remaining images to load (excluding already loaded ones)
        const remainingIndices = Array.from({ length: totalFrames }, (_, i) => i + 1)
          .filter(index => !imageCache.current[index - 1]);
        
        if (remainingIndices.length === 0) return;
        
        // Load frames based on importance:
        // 1. Load every 10th frame first to have rough animation working
        const skipFrames = remainingIndices.filter(index => index % 10 === 0);
        await loadImagesInParallel(skipFrames, 5);
        
        // 2. Load every 5th frame to refine animation
        const intermediateFrames = remainingIndices.filter(index => !skipFrames.includes(index) && index % 5 === 0);
        await loadImagesInParallel(intermediateFrames, 8);
        
        // 3. Load remaining frames
        const finalFrames = remainingIndices.filter(index => 
          !skipFrames.includes(index) && !intermediateFrames.includes(index));
        await loadImagesInParallel(finalFrames, 10);
      } catch (error) {
        console.error("Error in loadAllImages:", error);
      }
    };
    
    const loadImagesInParallel = async (indices, concurrency) => {
      // Process indices in batches with limited concurrency
      for (let i = 0; i < indices.length; i += concurrency) {
        const batch = indices.slice(i, i + concurrency);
        await Promise.all(batch.map(loadImage));
      }
    };

    const loadImage = (index) => {
      return new Promise((resolve, reject) => {
        // Skip if already loaded
        if (imageCache.current[index - 1]) {
          resolve();
          return;
        }
        
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.decoding = "async"; // Use async decoding for better performance
        
        // Add small random delay to prevent server throttling
        const delay = Math.random() * 50;
        setTimeout(() => {
          img.src = `/ImageSequence/desktop/TDlandingPage${index
            .toString()
            .padStart(4, "0")}.jpg`;
        }, delay);
        
        img.onload = () => {
          imageCache.current[index - 1] = img;
          setLoadedImages(prev => {
            const newCount = prev + 1;
            // Calculate progress based on total loaded images
            setProgress(Math.floor((newCount / totalFrames) * 100));
            return newCount;
          });
          resolve();
        };
        
        img.onerror = () => {
          console.error(`Failed to load image ${index}`);
          resolve(); // Resolve anyway to not block other images
        };
      });
    };

    preloadImages();
  }, []);

  const drawImage = (index) => {
    if (!canvasRef.current) return;
    
    // Find closest loaded image if exact frame isn't available
    let actualIndex = index;
    if (!imageCache.current[index]) {
      let found = false;
      
      // Try to find closest loaded image
      for (let distance = 1; distance < totalFrames && !found; distance++) {
        // Check before
        if (index - distance >= 0 && imageCache.current[index - distance]) {
          actualIndex = index - distance;
          found = true;
        }
        // Check after
        else if (index + distance < totalFrames && imageCache.current[index + distance]) {
          actualIndex = index + distance;
          found = true;
        }
      }
      
      if (!found) return; // No suitable image found
    }
    
    const ctx = canvasRef.current.getContext("2d", { alpha: false });
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      imageCache.current[actualIndex],
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

  // Handle scroll down animation
  const scrollDown = () => {
    // Scroll to approximately the first section
    const firstSectionHeight = window.innerHeight * 1.5;
    window.scrollTo({
      top: firstSectionHeight,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (loading && !canScroll) return;

    // Create a ScrollTrigger for smoother scrolling
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5, // Smoother scrubbing effect
      onUpdate: (self) => {
        // Determine scroll direction
        scrollDirection.current = self.direction > 0 ? 'forward' : 'backward';
        
        // Calculate the frame index based on scroll progress
        const progress = self.progress;
        let frameIndex = Math.min(
          totalFrames - 1,
          Math.floor(progress * totalFrames)
        );
        
        // Prevent jumping backward in animation unless actually scrolling backward
        if (scrollDirection.current === 'forward' && frameIndex < lastFrameIndex.current) {
          frameIndex = lastFrameIndex.current;
        }
        
        // Update the last frame index
        lastFrameIndex.current = frameIndex;
        
        // Draw the current frame
        drawImage(frameIndex);
        
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

    return () => {
      // Clean up ScrollTrigger
      scrollTrigger.kill();
      
      // Clean up GSAP animations
      Object.values(animationsRef.current).forEach(animations => {
        animations.forEach(tween => tween.kill());
      });
    };
  }, [loading, canScroll]);

  return (
    <div className="h-[600vh]" ref={containerRef}>
      {loading && (
        <div className="fixed top-0 inset-0 flex flex-col items-center justify-center bg-black z-50">
          <div className="text-white text-3xl font-bold mb-4">Loading...</div>
          <div className="w-3/4 sm:w-1/2 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-white text-xl mt-2">{progress}% </div>
          
          {canScroll && (
            <button 
              onClick={() => setLoading(false)}
              className="mt-8 px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
            >
              Start Viewing
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
            <div className="text-6xl font-bold text-white first-line">
              {title.firstLine}
            </div>
            <div className="text-6xl font-bold text-orange-600 highlight">
              {title.highlight} <t />
              <span className="text-6xl font-bold text-white">{title.secondLine}</span>
            </div>
          </div>
        ))}
        
        {/* Scroll Down Indicator */}
        <div 
          onClick={scrollDown}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer animate-bounce"
        >
          <span className="text-white text-sm mb-2">SCROLL DOWN</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SectionedImageScroller;