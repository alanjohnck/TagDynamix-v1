"use client"
import React, { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';

const TextAnimation = forwardRef(({ 
  text,
  colors = [],
  durations = [],
  staggers = [],
  className = "text-[3rem] md:text-6xl font-bold",
  scrollTriggerOptions = {},
  separator = ' '
}, ref) => {
  const textRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Split text, handling the separator
    const splitText = new SplitType(textRef.current, {
      types: "words, chars",
      wordClass: "split-word",
      charClass: "split-char"
    });
    
    const words = splitText.words;
    const chars = splitText.chars;
    const separatorElements = Array.from(textRef.current.querySelectorAll('.separator'));

    // Create timeline with scroll trigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggerOptions.trigger || textRef.current,
        start: scrollTriggerOptions.start || "top top",
        end: scrollTriggerOptions.end || "bottom center",
        scrub: scrollTriggerOptions.scrub || 1,
        id: "text-animation", // Unique ID to track
      }
    });

    // Animate colors with staggered effect
    colors.forEach((color, index) => {
      tl.to(words, {
        color,
        stagger: {
          each: staggers[index] || 0.1,
          from: "start",
          ease: "power2.inOut"
        },
        duration: durations[index] || 1,
      });
    });

    // Initial setup for separators
    if (separatorElements.length > 0) {
      gsap.set(separatorElements, {
        fontWeight: 200,
        color: "grey",
        fontSize: '0.8em'
      });
    }

    return () => {
      splitText.revert();
      tl.kill();
    };
  }, [colors, durations, staggers, scrollTriggerOptions, text]);

  // Render text with custom separator handling
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
});

TextAnimation.displayName = 'TextAnimation';
export default TextAnimation;