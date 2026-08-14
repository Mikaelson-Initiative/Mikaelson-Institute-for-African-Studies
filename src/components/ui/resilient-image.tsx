"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ResilientImageProps extends Omit<ImageProps, "onError" | "src"> {
  src: string;
  fallbackSrc?: string;
}

export function ResilientImage({
  src,
  fallbackSrc = "/brand/MIAS-placeholder.png", // Or any fallback logic
  alt,
  className,
  ...props
}: ResilientImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // If there is no src at all, immediately fall back.
  const imageSrc = src;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-ink/5 ${className || ""}`}>
      {!error && imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt || ""}
          className={`transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${props.fill ? "object-cover" : ""}`}
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
          {...props}
        />
      ) : (
        /* Fallback icon or empty state */
        <div className="flex h-full w-full items-center justify-center text-ink/20">
          <svg className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L28 20" />
          </svg>
        </div>
      )}
    </div>
  );
}
