"use client";
import React, { forwardRef, useEffect, useRef } from "react";

const TextAnimation = forwardRef(
  (
    {
      text,
      colors = ["#000000", "#FF0000", "#0000FF"],
      durations = [1, 1, 1],
      staggers = [0.1, 0.1, 0.1],
      className = "text-4xl md:text-6xl font-bold",
      scrollTriggerOptions = {},
      separator = " ",
    },
    ref
  ) => {
    const textRef = useRef(null);
    const splitTextRef = useRef(null);

    useEffect(() => {
      const setupAnimation = async () => {
        if (!scrollTriggerOptions.trigger) return;

        try {
          const gsap = (await import("gsap")).default;
          const { ScrollTrigger } = await import("gsap/ScrollTrigger");
          const SplitType = (await import("split-type")).default;

          gsap.registerPlugin(ScrollTrigger);

          // Clean up any previous split text
          if (splitTextRef.current) {
            splitTextRef.current.revert();
          }

          // Create new split text instance
          splitTextRef.current = new SplitType(textRef.current, {
            types: "words,chars",
            wordClass: "word inline-block",
            charClass: "char inline-block",
          });

          const words = splitTextRef.current.words;

          // Reset any existing animations
          gsap.set(words, { color: colors[0] });

          // Create timeline with scroll trigger
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: scrollTriggerOptions.trigger,
              start: scrollTriggerOptions.start || "top center",
              end: scrollTriggerOptions.end || "bottom center",
              scrub: scrollTriggerOptions.scrub ?? 1,
              toggleActions: "play none none reverse",
            },
          });

          // Add color animations
          colors.forEach((color, index) => {
            tl.to(words, {
              color,
              duration: durations[index],
              stagger: {
                each: staggers[index],
                from: "start",
                ease: "power2.inOut",
              },
            });
          });

          return () => {
            if (splitTextRef.current) {
              splitTextRef.current.revert();
            }
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            tl.kill();
          };
        } catch (error) {
          console.error("Error setting up animation:", error);
        }
      };

      setupAnimation();
    }, [colors, durations, staggers, scrollTriggerOptions, text]);

    const renderTextWithSeparator = () => {
      return text.split(separator).map((part, index, array) => (
        <React.Fragment key={index}>
          <span>{part.trim()}</span>
          {index < array.length - 1 && (
            <span className="separator mx-2 font-thin">{separator}</span>
          )}
        </React.Fragment>
      ));
    };

    return (
      <h1 ref={textRef} className={className}>
        {renderTextWithSeparator()}
      </h1>
    );
  }
);

TextAnimation.displayName = "TextAnimation";

export default TextAnimation;
