"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  animationData?: any;
  src?: string; // Add support for URL based if needed in future
  width?: number | string;
  height?: number | string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  src,
  width,
  height,
  className,
  loop = true,
  autoplay = true,
}) => {
  const [data, setData] = useState<any>(animationData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (src) {
      fetch(src)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch ${src}: ${response.statusText}`);
          }
          return response.json();
        })
        .then((jsonData) => setData(jsonData))
        .catch((error) =>
          console.error("Error loading Lottie animation:", error),
        );
    }
  }, [src]);

  if (!isMounted || !data) return null;

  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={{ width: width || "100%", height: height || "auto" }}
    />
  );
};

export default LottieAnimation;
