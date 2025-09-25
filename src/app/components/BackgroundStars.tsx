"use client";
import { useMemo, useEffect, useState } from "react";

export default function BackgroundStars() {
  const [stars, setStars] = useState<
    {
      top: number;
      left: number;
      size: number;
      delay: number;
      duration: number;
      floatDuration: number;
    }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 80 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      floatDuration: Math.random() * 10 + 5,
    }));
    setStars(generated);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white opacity-80 "
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `
              pulse ${s.duration}s ease-in-out ${s.delay}s infinite alternate,
              float ${s.floatDuration}s ease-in-out infinite
            `,
          }}
        />
      ))}
    </div>
  );
}
