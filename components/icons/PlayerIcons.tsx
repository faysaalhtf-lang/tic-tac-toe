
import React from 'react';

export const IconX = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full animate-marker-appear"
    style={{ filter: "drop-shadow(0 0 10px #0ea5e9) drop-shadow(0 0 20px #0ea5e9)" }}
  >
    <line x1="15" y1="15" x2="85" y2="85" stroke="#0ea5e9" strokeWidth="12" strokeLinecap="round" />
    <line x1="85" y1="15" x2="15" y2="85" stroke="#0ea5e9" strokeWidth="12" strokeLinecap="round" />
  </svg>
);

export const IconO = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full animate-marker-appear"
    style={{ filter: "drop-shadow(0 0 10px #f97316) drop-shadow(0 0 20px #f97316)" }}
  >
    <circle
      cx="50"
      cy="50"
      r="35"
      stroke="#f97316"
      strokeWidth="12"
      fill="none"
      className="animate-pulse"
    />
  </svg>
);
