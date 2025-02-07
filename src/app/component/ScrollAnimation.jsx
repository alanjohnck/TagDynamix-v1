import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IndustrialLoader from "./PreLoader";
import { throttle, debounce } from "lodash";

gsap.registerPlugin(ScrollTrigger);

const TextSequence = ({ words, isVisible, highlighted }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.0
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.15,
        staggerDirection: -1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 120
      }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div 
          className="flex gap-8 absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4"
          variants={container}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {words.map((word, index) => (
            <motion.span
              key={word}
              variants={item}
              className={`text-2xl md:text-6xl font-medium md:font-bold ${
                highlighted.includes(word) ? 'text-[#ed5729]' : 'text-white'
              }`}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ScrollAnimation = () => {
  const canvasRef = useRef(null);
  const airpodsRef = useRef({ frame: 0 });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSequence, setCurrentSequence] = useState(null);
  const containerRef = useRef(null);
  const loadedImagesCount = useRef(0);
  const touchEnabled = useRef(true);

  const sequences = useMemo(() => [
    {
      words: ["High", "Performance", "UI"],
      highlighted: ["UI"],
      frameRange: [2, 50]
    },
    {
      words: ["Immersive", "3D", "Engine"],
      highlighted: ["3D"],
      frameRange: [94, 186]
    },
    {
      words: ["Industrial", "AI", "Integration"],
      highlighted: ["AI"],
      frameRange: [187, 279]
    }
  ], []);

  // Improved device detection with immediate check
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };
    
    const isMobileDevice = checkDevice();
    const debouncedResize = debounce(checkDevice, 250);
    window.addEventListener("resize", debouncedResize);
    
    // Preload first few images immediately for faster initial render
    const preloadInitialImages = async () => {
      const imagePrefix = isMobileDevice ? "mobile" : "desktop";
      const initialImages = [1, 2, 3].map(i => {
        const img = new Image();
        img.src = `./ImageSequence/${imagePrefix}/TDlandingPage${i.toString().padStart(4, "0")}.jpg`;
        return img;
      });
      await Promise.all(initialImages.map(img => new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      })));
    };

    preloadInitialImages();

    return () => {
      window.removeEventListener("resize", debouncedResize);
      debouncedResize.cancel();
    };
  }, []);

  // Improved image loading with better progress tracking and error handling
  useEffect(() => {
    const frameCount = 280;
    const imagePrefix = isMobile ? "mobile" : "desktop";
    let mounted = true;
    const imageArray = new Array(frameCount - 2);
    loadedImagesCount.current = 0;

    const loadImage = async (index) => {
      try {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = `./ImageSequence/${imagePrefix}/TDlandingPage${(index + 1)
            .toString()
            .padStart(4, "0")}.jpg`;
        });
        if (mounted) {
          imageArray[index - 1] = img;
          loadedImagesCount.current++;
          setLoadingProgress((loadedImagesCount.current / (frameCount - 2)) * 100);
        }
      } catch (error) {
        console.error(`Error loading image ${index}:`, error);
      }
    };

    const loadImagesInBatches = async () => {
      const batchSize = 10;
      for (let i = 1; i < frameCount - 1; i += batchSize) {
        if (!mounted) break;
        
        const batch = Array.from({ length: Math.min(batchSize, frameCount - 1 - i) }, 
          (_, index) => loadImage(i + index));
        
        await Promise.all(batch);
      }

      if (mounted) {
        setImages(imageArray.filter(Boolean));
        setImagesLoaded(true);
        setLoading(false);
        touchEnabled.current = false;
      }
    };

    loadImagesInBatches();

    return () => {
      mounted = false;
    };
  }, [isMobile]);

  // Improved scroll animation setup
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const updateCanvasSize = throttle(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }, 100);

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    let rafId = null;
    const render = () => {
      if (!images[airpodsRef.current.frame]) return;
      
      context.clearRect(0, 0, canvas.width, canvas.height);
    
      const imageAspectRatio = isMobile ? 1080 / 1920 : 1980 / 1080;
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
      
      const frame = airpodsRef.current.frame;
      const sequence = sequences.find(
        seq => frame >= seq.frameRange[0] && frame <= seq.frameRange[1]
      );
      
      setCurrentSequence(sequence);
    };

    // Slower, smoother scroll animation
    const scrollAnimation = gsap.to(airpodsRef.current, {
      frame: images.length - 1,
      snap: "frame",
      ease: "power1.inOut", // Smoother easing
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top ",
        end: "+=100% ", // Increased scroll length for smoother animation
        scrub: 2.5, // Increased scrub time for smoother scrolling
        id: "video-animation", // Unique ID to track
        markers:true,
        pin: true,
        anticipatePin: 1,
        preventOverlaps: true,
        onUpdate: (self) => {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(render);
        },
        onLeave: () => {
          // Cleanup when leaving the section
          if (rafId) cancelAnimationFrame(rafId);
        }
      },
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateCanvasSize);
      updateCanvasSize.cancel();
      scrollAnimation.kill();
    };
  }, [imagesLoaded, images, sequences, isMobile]);

  return (
    <main className="overflow-x-hidden overflow-y-hidden bg-black  ">
      <div 
        ref={containerRef} 
        id="scroll-container" 
        className="h-[100vh] relative"
        style={{ touchAction: touchEnabled.current ? 'none' : 'auto' }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center bg-black overflow-hidden">
          {loading && (
            <div className="w-screen h-screen absolute z-40 flex flex-col items-center justify-center text-white">
              <IndustrialLoader progress={loadingProgress} />
              <div className="mt-4 text-lg">Loading: {Math.round(loadingProgress)}%</div>
            </div>
          )}
          <canvas ref={canvasRef} className="z-0" />
          {sequences.map((seq, index) => (
            <TextSequence
              key={index}
              words={seq.words}
              highlighted={seq.highlighted}
              isVisible={currentSequence === seq}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ScrollAnimation;