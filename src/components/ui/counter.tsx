"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

export function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.4,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Vertical-only margin: a symmetric inset on all sides shrinks the
  // horizontal hit zone too, which on narrow viewports can push
  // left/right-aligned content outside it entirely and it never triggers.
  const inView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("hu-HU")}
      {suffix}
    </span>
  );
}
