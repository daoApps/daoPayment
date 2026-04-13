'use client';

interface MonadLogoProps {
  size?: number;
}

export function MonadLogo({ size = 24 }: MonadLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-accent-primary"
    >
      <path
        d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M9 8V16L12 13L15 16V8"
        stroke="url(#gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="gradient"
          x1="9"
          y1="8"
          x2="15"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7b61ff" />
          <stop offset="1" stopColor="#00d4ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
