export function LiquidDrop() {
  return (
    <div className="drop-stage">
      <div className="drop-glow" />
      <svg
        className="drop-svg"
        viewBox="0 0 300 440"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Animated liquid drop"
      >
        <defs>
          <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE48A" />
            <stop offset="45%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFBE8" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#FFF3C4" stopOpacity={0.7} />
          </linearGradient>
          <radialGradient id="hiGrad" cx="0.3" cy="0.25" r="0.5">
            <stop offset="0%" stopColor="white" stopOpacity={0.85} />
            <stop offset="60%" stopColor="white" stopOpacity={0.15} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="hiGrad2" cx="0.7" cy="0.7" r="0.3">
            <stop offset="0%" stopColor="white" stopOpacity={0.4} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </radialGradient>
          <clipPath id="dropClip">
            <path d="M150 8 C 150 8, 295 225, 295 300 A 145 145 0 0 1 5 300 C 5 225, 150 8, 150 8 Z" />
          </clipPath>
        </defs>

        <path d="M150 8 C 150 8, 295 225, 295 300 A 145 145 0 0 1 5 300 C 5 225, 150 8, 150 8 Z" fill="url(#glassGrad)" />

        <g clipPath="url(#dropClip)">
          <path fill="url(#liquidGrad)">
            <animate
              attributeName="d"
              dur="3.5s"
              repeatCount="indefinite"
              values="
                M-10 270 C 60 250, 120 290, 180 270 S 310 250, 320 270 L 320 450 L -10 450 Z;
                M-10 275 C 60 295, 120 255, 180 275 S 310 295, 320 275 L 320 450 L -10 450 Z;
                M-10 268 C 60 248, 120 288, 180 268 S 310 248, 320 268 L 320 450 L -10 450 Z;
                M-10 270 C 60 250, 120 290, 180 270 S 310 250, 320 270 L 320 450 L -10 450 Z
              "
            />
          </path>
          <path fill="rgba(255,255,255,0.18)">
            <animate
              attributeName="d"
              dur="4.2s"
              repeatCount="indefinite"
              values="
                M-10 280 C 70 265, 130 295, 190 280 S 320 265, 320 280 L 320 450 L -10 450 Z;
                M-10 285 C 70 305, 130 265, 190 285 S 320 305, 320 285 L 320 450 L -10 450 Z;
                M-10 280 C 70 265, 130 295, 190 280 S 320 265, 320 280 L 320 450 L -10 450 Z
              "
            />
          </path>
        </g>

        <path
          d="M150 8 C 150 8, 295 225, 295 300 A 145 145 0 0 1 5 300 C 5 225, 150 8, 150 8 Z"
          fill="none"
          stroke="rgba(11,61,36,0.28)"
          strokeWidth="2.5"
        />

        <ellipse cx="95" cy="160" rx="38" ry="80" fill="url(#hiGrad)" transform="rotate(-15 95 160)" />
        <circle cx="210" cy="320" r="22" fill="url(#hiGrad2)" />
        <circle cx="150" cy="40" r="4" fill="white" opacity="0.7">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="drop-bubbles" aria-hidden="true">
        <div className="bubble b1" style={{ ['--bx' as any]: '-20px' }} />
        <div className="bubble b2" style={{ ['--bx' as any]: '30px' }} />
        <div className="bubble b3" style={{ ['--bx' as any]: '-10px' }} />
        <div className="bubble b4" style={{ ['--bx' as any]: '25px' }} />
        <div className="bubble b5" style={{ ['--bx' as any]: '-30px' }} />
      </div>

      <div className="ripples" aria-hidden="true">
        <div className="ring" />
        <div className="ring" />
        <div className="ring" />
      </div>
    </div>
  );
}