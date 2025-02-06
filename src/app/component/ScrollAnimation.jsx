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
        staggerChildren: 0.3,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
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
        damping: 12,
        stiffness: 100
      }
    },
    exit: { 
      y: -20, 
      opacity: 0
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
              className={`text-6xl font-bold ${
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
      frameRange: [15, 60]
    },
    {
      words: ["Immersive", "3D", "Engine"],
      highlighted: ["3D"],
      frameRange: [105, 180]
    },
    {
      words: ["Industrial", "AI", "Integration"],
      highlighted: ["AI"],
      frameRange: [200, 250]
    }
  ], []);

  // Optimized device type detection
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    const debouncedResize = debounce(checkDevice, 250);
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      debouncedResize.cancel();
    };
  }, []);

  // Optimized image loading
  useEffect(() => {
    const frameCount = 280;
    const imagePrefix = isMobile ? "mobile" : "desktop";
    let mounted = true;
    const imagePromises = [];
    const imageArray = new Array(frameCount - 2);
    loadedImagesCount.current = 0;

    // Create image loading promises in chunks
    const loadImageChunk = async (startIdx, endIdx) => {
      for (let i = startIdx; i < endIdx && i < frameCount - 1; i++) {
        const img = new Image();
        const promise = new Promise((resolve, reject) => {
          img.onload = () => {
            if (mounted) {
              loadedImagesCount.current++;
              imageArray[i - 1] = img;
              resolve();
            }
          };
          img.onerror = reject;
        });

        img.src = `./ImageSequence/${imagePrefix}/TDlandingPage${(i + 1)
          .toString()
          .padStart(4, "0")}.jpg`;
        imagePromises.push(promise);
      }
    };

    // Load images in chunks of 20
    const chunkSize = 20;
    const loadAllChunks = async () => {
      for (let i = 1; i < frameCount - 1; i += chunkSize) {
        await loadImageChunk(i, i + chunkSize);
        if (loadedImagesCount.current >= frameCount - 2) {
          break;
        }
      }

      try {
        await Promise.all(imagePromises);
        if (mounted) {
          setImages(imageArray.filter(Boolean));
          setImagesLoaded(true);
          setLoading(false);
          touchEnabled.current = false; // Disable touch events after loading
        }
      } catch (error) {
        console.error("Error loading images:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAllChunks();

    return () => {
      mounted = false;
    };
  }, [isMobile]);

  // Canvas and animation setup
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

    const render = throttle(() => {
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
    }, 16); // Throttle to ~60fps

    images[0] && render();

    const scrollAnimation = gsap.to(airpodsRef.current, {
      frame: images.length - 1,
      snap: "frame",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "+=100%",
        scrub: 6,
        pin: true,
      },
      onUpdate: render,
    });

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      updateCanvasSize.cancel();
      render.cancel();
      scrollAnimation.kill();
    };
  }, [imagesLoaded, images, sequences, isMobile]);

  return (
    <main className="overflow-x-hidden">
      <div 
        ref={containerRef} 
        id="scroll-container" 
        className="h-[100vh] relative"
        style={{ touchAction: touchEnabled.current ? 'none' : 'auto' }}
      >
        <div className="h-screen flex items-center justify-center bg-black sticky top-0 overflow-hidden">
          {loading && (
            <div className="w-screen h-screen absolute z-40 flex flex-col items-center justify-center text-white">
              <IndustrialLoader />
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