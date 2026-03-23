import { Variants } from "framer-motion";

type Direction = "left" | "right" | "up" | "down";

export const slideFadeIn = (
  direction: Direction = "up",
  distance: number = 50,
  duration: number = 0.5,
  delay: number = 0
): Variants => {
  const axis = {
    left: { x: -distance },
    right: { x: distance },
    up: { y: distance },
    down: { y: -distance },
  };

  return {
    hidden: {
      opacity: 0,
      ...axis[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay, // move delay here
        ease: "easeOut",
      },
    },
  };
};