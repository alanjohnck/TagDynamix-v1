"use client";

import { motion } from "framer-motion";
import { Cog } from "lucide-react";

export default function IndustrialLoader({ size = 100, color = "#ffffff", backgroundColor = "#2C3E50" }) {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor,
        }}
        animate={{
          boxShadow: [
            `0 0 0 ${size * 0.05}px rgba(255, 107, 107, 0.1)`,
            `0 0 0 ${size * 0.05}px rgba(255, 107, 107, 0.3)`,
            `0 0 0 ${size * 0.05}px rgba(255, 107, 107, 0.1)`,
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Cog size={size * 0.6} color={color} />
        </motion.div>
      </motion.div>
    </div>
  );
}
