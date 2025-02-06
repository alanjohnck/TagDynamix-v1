"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import IndustrialLoader from "./PreLoader"

gsap.registerPlugin(ScrollTrigger)

const TextSequence = ({ words, isVisible, highlighted }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

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
              key={word + index}
              variants={item}
              className={`text-6xl font-bold ${highlighted.includes(word) ? "text-[#ed5729]" : "text-white"}`}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const ScrollAnimation = () => {
  const canvasRef = useRef(null)
  const airpodsRef = useRef({ frame: 0 })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [currentSequence, setCurrentSequence] = useState(null)
  const containerRef = useRef(null)

  const sequences = [
    {
      words: ["High", "Performance", "UI"],
      highlighted: ["UI"],
      frameRange: [1, 50],
    },
    {
      words: ["Immersive", "3D", "Engine"],
      highlighted: ["3D"],
      frameRange: [105, 180],
    },
    {
      words: ["Industrial", "AI", "Integration"],
      highlighted: ["AI"],
      frameRange: [180, 280],
    },
  ]

  useEffect(() => {
    const updateDeviceType = () => {
      setIsMobile(window.innerWidth < 768)
    }

    updateDeviceType()
    window.addEventListener("resize", updateDeviceType)
    return () => window.removeEventListener("resize", updateDeviceType)
  }, [])

  useEffect(() => {
    const frameCount = 280
    const imageArray = []
    const imagePrefix = isMobile ? "mobile" : "desktop"

    const loadImages = async () => {
      for (let i = 1; i < frameCount - 1; i++) {
        const img = new Image()
        img.src = `./ImageSequence/${imagePrefix}/TDlandingPage${(i + 1).toString().padStart(4, "0")}.jpg`

        await new Promise((resolve) => {
          img.onload = resolve
        })

        imageArray.push(img)
        setLoadingProgress(Math.round(((i + 1) / frameCount) * 100))
      }
      setImages(imageArray)
      setLoading(false)
    }

    loadImages()
  }, [isMobile])

  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    const render = () => {
      if (!images[airpodsRef.current.frame]) return
      context.clearRect(0, 0, canvas.width, canvas.height)

      const imageAspectRatio = isMobile ? 1080 / 1920 : 1980 / 1080
      const imageScale = 1.15
      let scaledWidth = window.innerWidth * imageScale
      let scaledHeight = scaledWidth / imageAspectRatio

      if (scaledHeight > window.innerHeight) {
        scaledHeight = window.innerHeight * imageScale
        scaledWidth = scaledHeight * imageAspectRatio
      }

      const x = (canvas.width - scaledWidth) / 2
      const y = (canvas.height - scaledHeight) / 2

      context.drawImage(images[airpodsRef.current.frame], x, y, scaledWidth, scaledHeight)

      const frame = airpodsRef.current.frame
      const sequenceIndex = sequences.findIndex((seq) => frame >= seq.frameRange[0] && frame <= seq.frameRange[1])

      setCurrentSequence(sequenceIndex !== -1 ? sequenceIndex : null)
    }

    images[0].onload = render

    gsap.to(airpodsRef.current, {
      frame: images.length - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "+=100% ",
        scrub: 6,
        pin: true,
      },
      onUpdate: render,
    })

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [images, isMobile])

  return (
    <main className="overflow-x-hidden">
      <div ref={containerRef} id="scroll-container" className="h-[100vh] relative">
        <div className="h-[100vh] flex items-center justify-center bg-black sticky top-0 overflow-hidden">
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
              isVisible={currentSequence === index}
            />
          ))}
          {loadingProgress < 100 && (
            <div className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
              {loadingProgress}%
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ScrollAnimation

