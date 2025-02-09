import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const SectionedImageScroller = () => {
  const totalFrames = 280;
  const sectionsCount = 3;
  const framesPerSection = Math.floor(totalFrames / sectionsCount);

  const sections = [
    { start: 1, end: framesPerSection, title: "High performance", highlight: "UI" },
    { start: framesPerSection + 1, end: framesPerSection * 2, title: "Seamless", highlight: "Integration" },
    { start: framesPerSection * 2 + 1, end: totalFrames, title: "Smart", highlight: "Automation" },
  ];

  const [currentSection, setCurrentSection] = useState(0);
  const [showText, setShowText] = useState(true);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(`/ImageSequence/desktop/TDlandingPage0001.jpg`);

  const frameRef = useRef(1);
  const textRef = useRef(null);
  const loaderRef = useRef(null);
  const scrollHintRef = useRef(null);
  const isAnimating = useRef(false);

  const playSection = (sectionIndex, reverse = false) => {
    if (isAnimating.current || sectionIndex < 0 || sectionIndex >= sections.length) return;

    isAnimating.current = true;
    setShowText(false);

    const section = sections[sectionIndex];
    const startFrame = reverse ? section.end : section.start;
    const endFrame = reverse ? section.start : section.end;

    gsap.to(frameRef, {
      current: endFrame,
      duration: 3.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const frameNum = Math.round(frameRef.current);
        setImageSrc(`/ImageSequence/desktop/TDlandingPage${frameNum.toString().padStart(4, "0")}.jpg`);
      },
      onComplete: () => {
        isAnimating.current = false;
        setTimeout(() => setShowText(true), 500);
      },
    });

    setCurrentSection(sectionIndex);
  };

  useEffect(() => {
    const handleScroll = (event) => {
      if (isAnimating.current) return;
      const isScrollingDown = event.deltaY > 0;

      setCurrentSection((prev) => {
        let newSection = isScrollingDown ? prev + 1 : prev - 1;
        if (newSection < 0 || newSection >= sections.length) return prev;

        playSection(newSection, !isScrollingDown);
        return newSection;
      });
    };

    const options = { passive: false };
    window.addEventListener("wheel", handleScroll, options);

    return () => {
      window.removeEventListener("wheel", handleScroll, options);
    };
  }, []);

  useEffect(() => {
    gsap.to(loaderRef.current, {
      opacity: 0,
      duration: 1.2,
      delay: 2,
      onComplete: () => setLoading(false),
    });

    gsap.fromTo(
      scrollHintRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, repeat: -1, yoyo: true, duration: 1.2, ease: "power1.inOut" }
    );

    playSection(0);

    return () => {
      gsap.killTweensOf(frameRef);
    };
  }, []);

  useEffect(() => {
    if (showText && textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [showText]);

  const currentSectionData = sections[currentSection] || { title: "", highlight: "" };

  return (
    <div className="h-[300vh]">
      {/* Loader */}
      {loading && (
        <div ref={loaderRef} className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <div className="text-white text-3xl font-bold">Loading...</div>
        </div>
      )}

      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex justify-center items-center bg-black">
        {/* Image Frame with Next.js <Image /> */}
        <Image
          src={imageSrc}
          alt="Frame"
          layout="fill"
          objectFit="cover"
          priority
        />

        {/* Scroll Down Indicator */}
        <div ref={scrollHintRef} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-lg">
          ↓ Scroll Down ↓
        </div>

        {/* Animated Text */}
        {showText && (
          <div ref={textRef} className="absolute top-[20%] left-0 right-0 px-12 text-center opacity-0">
            <h1 className="text-7xl font-bold text-white mb-4">
              {currentSectionData.title} <span className="text-orange-600">{currentSectionData.highlight}</span>
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionedImageScroller;
