import React from 'react';

const FiltaLogo = ({ size = 24, color = '#667eea' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle representing a filter */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke={color}
        strokeWidth="4"
        fill="none"
      />
      
      {/* Filter funnel shape */}
      <path
        d="M25 25 L75 25 L60 45 L40 45 Z"
        fill={color}
        opacity="0.8"
      />
      
      {/* Filter neck */}
      <rect
        x="45"
        y="45"
        width="10"
        height="20"
        fill={color}
        opacity="0.8"
      />
      
      {/* Droplet at bottom */}
      <path
        d="M50 65 C45 65 42 68 42 72 C42 76 45 79 50 79 C55 79 58 76 58 72 C58 68 55 65 50 65 Z"
        fill={color}
      />
      
      {/* Small dots representing filtered content */}
      <circle cx="35" cy="35" r="2" fill={color} opacity="0.6" />
      <circle cx="50" cy="30" r="2" fill={color} opacity="0.6" />
      <circle cx="65" cy="35" r="2" fill={color} opacity="0.6" />
      
      {/* Arrow indicating download/flow */}
      <path
        d="M70 55 L75 60 L70 65 M75 60 L65 60"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FiltaLogo;