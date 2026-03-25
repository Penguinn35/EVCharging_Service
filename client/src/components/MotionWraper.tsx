"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { slideFadeIn } from "@/lib/animation";

type Props = {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
};

export default function MotionWrapper({
  children,
  direction = "up",
  delay = 0,
  duration = 1,
  distance = 50,
  className,
}: Props) {
  return (
    <motion.div
      variants={slideFadeIn(direction, distance, duration, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
