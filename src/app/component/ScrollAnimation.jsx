"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const SectionedImageScroller = () => {
  const totalFrames = 279
  const titles = [
    {
      firstLine: "High Performance",
      highlight: "HMI & SCADA",
      secondLine: "Solutions",
    },
    {
      firstLine: "Immersive",
      highlight: "3D",
      secondLine: "Engine Visualization",
    },
    {
      firstLine: "Industrial",
      highlight: "AI",
      secondLine: "Integration",
    },
  ]

  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [loadedImages, setLoadedImages] = useState(0)
  const imageCache = useRef([])
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animationsRef = useRef({})
  const currentTitleRef = useRef(-1)
  const lastFrameIndex = useRef(0)
  const scrollDirection = useRef("forward")
  const loadingTimeoutRef = useRef(null)

  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  useEffect(() => {
    // Initialize and prep canvas
    if (canvasRef.current) {
      // Set canvas size optimization
      const ctx = canvasRef.current.getContext("2d", { alpha: false })
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "medium" // Balance between quality and performance
    }

    // Set a short timeout to ensure loading doesn't show for too long
    loadingTimeoutRef.current = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached, showing content")
        setLoading(false)
      }
    }, 3000) // Only show loader for max 3 seconds

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [loading])

  useEffect(() => {
    const preloadImages = async () => {
      try {
        // Preload key frames first for initial display
        await preloadKeyFrames()

        // Once key frames are loaded, hide the loader
        setLoading(false)

        // Draw the first image immediately
        drawImage(0)

        // Then load all images in parallel with optimized strategy
        loadAllImages()
      } catch (error) {
        console.error("Error loading images:", error)
        setLoading(false)
      }
    }

    preloadImages()
  }, [])

  const preloadKeyFrames = async () => {
    // Load key frames first (start of each section + some extras)
    const framesPerSection = Math.floor(totalFrames / titles.length)
    const keyFrames = []

    // Just load the first few frames to get started quickly
    keyFrames.push(1) // First frame
    keyFrames.push(Math.floor(totalFrames * 0.1)) // 10% in

    // Remove duplicates
    const uniqueKeyFrames = [...new Set(keyFrames)].filter((f) => f <= totalFrames)

    // Load key frames with higher priority
    await Promise.all(uniqueKeyFrames.map(loadImage))
  }

  const loadAllImages = async () => {
    // Use a more efficient loading strategy with progressive enhancement
    try {
      // Create array of remaining images to load (excluding already loaded ones)
      const remainingIndices = Array.from({ length: totalFrames }, (_, i) => i + 1).filter(
        (index) => !imageCache.current[index - 1],
      )

      if (remainingIndices.length === 0) return

      // Load frames based on importance:
      // 1. Load every 10th frame first to have rough animation working
      const skipFrames = remainingIndices.filter((index) => index % 10 === 0)
      await loadImagesInParallel(skipFrames, 5)

      // 2. Load every 5th frame to refine animation
      const intermediateFrames = remainingIndices.filter((index) => !skipFrames.includes(index) && index % 5 === 0)
      await loadImagesInParallel(intermediateFrames, 8)

      // 3. Load remaining frames
      const finalFrames = remainingIndices.filter(
        (index) => !skipFrames.includes(index) && !intermediateFrames.includes(index),
      )
      await loadImagesInParallel(finalFrames, 10)
    } catch (error) {
      console.error("Error in loadAllImages:", error)
    }
  }

  const loadImagesInParallel = async (indices, concurrency) => {
    // Process indices in batches with limited concurrency
    for (let i = 0; i < indices.length; i += concurrency) {
      const batch = indices.slice(i, i + concurrency)
      await Promise.all(batch.map(loadImage))
    }
  }

  const loadImage = (index) => {
    return new Promise((resolve, reject) => {
      // Skip if already loaded
      if (imageCache.current[index - 1]) {
        resolve()
        return
      }

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.decoding = "async" // Use async decoding for better performance

      // Add small random delay to prevent server throttling
      const delay = Math.random() * 1
      setTimeout(() => {
        img.src = `/ImageSequence/desktop/TDlandingPage${index.toString().padStart(4, "0")}.jpg`
      }, delay)

      img.onload = () => {
        imageCache.current[index - 1] = img
        setLoadedImages((prev) => {
          const newCount = prev + 1
          // Calculate progress based on total loaded images
          setProgress(Math.floor((newCount / totalFrames) * 100))
          return newCount
        })
        resolve()
      }

      img.onerror = () => {
        console.error(`Failed to load image ${index}`)
        resolve() // Resolve anyway to not block other images
      }
    })
  }

  const drawImage = (index) => {
    if (!canvasRef.current) return

    // Find closest loaded image if exact frame isn't available
    let actualIndex = index
    if (!imageCache.current[index]) {
      let found = false

      // Try to find closest loaded image
      for (let distance = 1; distance < totalFrames && !found; distance++) {
        // Check before
        if (index - distance >= 0 && imageCache.current[index - distance]) {
          actualIndex = index - distance
          found = true
        }
        // Check after
        else if (index + distance < totalFrames && imageCache.current[index + distance]) {
          actualIndex = index + distance
          found = true
        }
      }

      if (!found) return // No suitable image found
    }

    const ctx = canvasRef.current.getContext("2d", { alpha: false })
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    ctx.drawImage(imageCache.current[actualIndex], 0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  const animateTitle = (index, show) => {
    const textContainer = document.querySelector(`#text-${index}`)
    if (!textContainer) return

    if (animationsRef.current[index]) {
      animationsRef.current[index].forEach((tween) => tween.kill())
    }
    animationsRef.current[index] = []

    const firstLine = textContainer.querySelector(".first-line")
    const highlight = textContainer.querySelector(".highlight")
    const secondLine = textContainer.querySelector(".second-line")

    animationsRef.current[index].push(
      gsap.to(textContainer, {
        opacity: show ? 1 : 0,
        duration: show ? 0.5 : 0.3,
        ease: show ? "power2.out" : "power2.in",
      }),
    )

    // Animate each line separately with progressive delays
    if (show) {
      gsap.fromTo(firstLine, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" })

      gsap.fromTo(highlight, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: "power2.out" })

      gsap.fromTo(
        secondLine,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: "power2.out" },
      )
    } else {
      gsap.to([firstLine, highlight, secondLine], {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      })
    }
  }

  // Handle scroll down animation
  const scrollDown = () => {
    // Scroll to approximately the first section
    const firstSectionHeight = window.innerHeight * 1.5
    window.scrollTo({
      top: firstSectionHeight,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    if (loading) return

    // Create a ScrollTrigger for smoother scrolling
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5, // Smoother scrubbing effect
      onUpdate: (self) => {
        // Determine scroll direction
        scrollDirection.current = self.direction > 0 ? "forward" : "backward"

        // Calculate the frame index based on scroll progress
        const progress = self.progress
        let frameIndex = Math.min(totalFrames - 1, Math.floor(progress * totalFrames))

        // Prevent jumping backward in animation unless actually scrolling backward
        if (scrollDirection.current === "forward" && frameIndex < lastFrameIndex.current) {
          frameIndex = lastFrameIndex.current
        }

        // Update the last frame index
        lastFrameIndex.current = frameIndex

        // Draw the current frame
        drawImage(frameIndex)

        // Calculate which title should be shown
        const titleIndex = Math.floor(progress * titles.length)

        if (titleIndex !== currentTitleRef.current) {
          if (currentTitleRef.current !== -1) {
            animateTitle(currentTitleRef.current, false)
          }

          animateTitle(titleIndex, true)
          currentTitleRef.current = titleIndex
        }
      },
    })

    return () => {
      // Clean up ScrollTrigger
      scrollTrigger.kill()

      // Clean up GSAP animations
      Object.values(animationsRef.current).forEach((animations) => {
        animations.forEach((tween) => tween.kill())
      })
    }
  }, [loading])

  return (
    <div className="h-[600vh]" ref={containerRef}>
      {loading && (
        <div className="fixed top-0 inset-0 flex flex-col items-center justify-center bg-black z-50">
          <div className="text-white text-3xl font-bold mb-4">Loading...</div>
          <div className="w-3/4 sm:w-1/2 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-white text-xl mt-2">{progress}%</div>
        </div>
      )}

      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex justify-center items-center bg-black">
        <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full object-cover" />

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

        {/* Scroll Down Indicator - Fixed centering for all devices */}
        <div
          onClick={scrollDown}
          className="absolute bottom-8 w-full flex justify-center items-center cursor-pointer animate-bounce"
        >
          <div className="flex flex-col items-center">
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
    </div>
  )
}

export default SectionedImageScroller

