import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Luna and Sol Logo"
    >
      {/* Sun */}
      <circle cx="65" cy="35" r="20" className="stroke-current" strokeWidth="2" />
      {/* Moon */}
      <path
        d="M35 80C46.0457 80 55 71.0457 55 60C55 48.9543 46.0457 40 35 40C32.75 40 30.6 40.37 28.6 41.05C32.3 43.5 35 47.5 35 52C35 60 27 64 22 62C23.5 72.1 32 80 35 80Z"
        className="fill-current"
      />
    </svg>
  );
};
