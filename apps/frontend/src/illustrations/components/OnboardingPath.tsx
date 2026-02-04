"use client";

import React from "react";
import { motion } from "framer-motion";
import { IllustrationProps } from "../types";

export const OnboardingPath: React.FC<IllustrationProps> = ({ className, size = "100%" }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial="initial"
      animate="animate"
      aria-hidden="true"
    >
      {/* Curved Path */}
      <motion.path
        d="M50 300C120 300 150 100 250 100C350 100 380 200 450 200"
        stroke="hsl(var(--primary))"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="10 10"
        fill="none"
        variants={{
          animate: {
            strokeDashoffset: [0, -20],
            transition: { duration: 2, repeat: Infinity, ease: "linear" },
          },
        }}
      />

      {/* Floating Steps/Points */}
      {[
        { cx: 80, cy: 300, delay: 0 },
        { cx: 200, cy: 150, delay: 0.2 },
        { cx: 320, cy: 120, delay: 0.4 },
      ].map((point, i) => (
        <motion.circle
          key={i}
          cx={point.cx}
          cy={point.cy}
          r="8"
          fill="hsl(var(--primary))"
          variants={{
            initial: { scale: 0, opacity: 0 },
            animate: {
              scale: [1, 1.2, 1],
              opacity: 1,
              transition: {
                delay: point.delay,
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            },
          }}
        />
      ))}
    </motion.svg>
  );
};
