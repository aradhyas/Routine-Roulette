import React, { memo } from "react";

export type KnittingCatProps = {
  /** Width of the SVG container. e.g. 560, "100%" */
  width?: number | string;
  /** Height of the SVG container. e.g. 360 */
  height?: number | string;
  /** Animation speed multiplier. 1 = normal, 2 = faster, 0.5 = slower */
  speed?: number;
  /** Warm (default), cool, or mono color theme */
  theme?: "warm" | "cool" | "mono";
  /** Pause all animations */
  paused?: boolean;
};

/**
 * Pure-SVG animated scene: a cozy cat knitting a sweater by the fireplace.
 * No images, no external libs. Drop this in: `frontend/src/components/KnittingCat.tsx`.
 */
const KnittingCat: React.FC<KnittingCatProps> = memo(
  ({ width = 600, height = 420, speed = 1, theme = "warm", paused = false }) => {
    const styleVars: React.CSSProperties = {
      // CSS custom props used by animations/colors
      ["--speed" as any]: String(speed),
      ["--paused" as any]: paused ? "paused" : "running",
    };

    return (
      <div className={`kc-root kc-theme-${theme}`} style={styleVars}>
        <style>{`
          .kc-root { position: relative; }
          .kc-root svg { display: block; max-width: 100%; height: auto; }

          /* ================= Colors (themes) ================= */
          .kc-theme-warm { 
            --bg:#1a1a2e; --stone:#4a4a5a; --mortar:#353545; --wood:#8b6f47;
            --flame1:#ff9a56; --flame2:#ff6b35; --flame3:#ffcc70;
            --fur:#f4a261; --fur-dark:#e76f51; --nose:#8b4513; --eye:#2a1810;
            --sweater:#2a9d8f; --yarn:#e9c46a; --thread:#f4a261;
            --rug:#264653; --chair:#2a9d8f; --shadow:#0008; --stroke:#0003;
          }
          .kc-theme-cool {
            --bg:#1f2430; --stone:#3a4456; --mortar:#2a3141; --wood:#4c6171;
            --flame1:#ffc27a; --flame2:#ff8a5b; --flame3:#ffe08a;
            --fur:#b8d0ff; --fur-dark:#9ab6eb; --nose:#6c7a8a; --eye:#0f1621;
            --sweater:#7dcfff; --yarn:#7ee787; --thread:#3a8f4e;
            --rug:#5b7c99; --chair:#587a92; --shadow:#0008; --stroke:#0004;
          }
          .kc-theme-mono {
            --bg:#262626; --stone:#3a3a3a; --mortar:#2b2b2b; --wood:#4a4a4a;
            --flame1:#ffee99; --flame2:#ffcc66; --flame3:#fff3b2;
            --fur:#c9c9c9; --fur-dark:#adadad; --nose:#7a7a7a; --eye:#111111;
            --sweater:#9e9e9e; --yarn:#bdbdbd; --thread:#888888;
            --rug:#7a7a7a; --chair:#6e6e6e; --shadow:#0008; --stroke:#0004;
          }

          /* ================= Animations ================= */
          .kc-root * { vector-effect: non-scaling-stroke; }
          .kc-anim { animation-play-state: var(--paused); }
          .kc-pivot { transform-box: fill-box; transform-origin: center; }

          @keyframes kc-fire {
            0%,100% { transform: translateY(0) scale(1) rotate(-2deg); opacity: .9; }
            25% { transform: translateY(-4px) scale(1.08) rotate(1deg); opacity: 1; }
            50% { transform: translateY(-2px) scale(1.05) rotate(-1deg); opacity: .95; }
            75% { transform: translateY(-3px) scale(1.06) rotate(2deg); opacity: 1; }
          }
          @keyframes kc-blink {
            0%, 90%, 100% { transform: scaleY(1); }
            92%, 94% { transform: scaleY(0.1); }
            96%, 98% { transform: scaleY(0.05); }
          }
          @keyframes kc-purr {
            0%,100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          @keyframes kc-tail {
            0%,100% { transform: rotate(8deg); }
            25% { transform: rotate(-4deg); }
            50% { transform: rotate(6deg); }
            75% { transform: rotate(-2deg); }
          }
          @keyframes kc-knit-left {
            0%,100% { transform: rotate(-12deg) translateY(0); }
            25% { transform: rotate(8deg) translateY(-1px); }
            50% { transform: rotate(-6deg) translateY(1px); }
            75% { transform: rotate(10deg) translateY(-0.5px); }
          }
          @keyframes kc-knit-right {
            0%,100% { transform: rotate(12deg) translateY(0); }
            25% { transform: rotate(-8deg) translateY(-1px); }
            50% { transform: rotate(6deg) translateY(1px); }
            75% { transform: rotate(-10deg) translateY(-0.5px); }
          }
          @keyframes kc-thread {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -80; }
          }
          @keyframes kc-bob {
            0%,100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-3px) rotate(1deg); }
            50% { transform: translateY(-1px) rotate(-1deg); }
            75% { transform: translateY(-2px) rotate(0.5deg); }
          }

          .kc-fire { animation: kc-fire calc(0.8s / var(--speed)) ease-in-out infinite; }
          .kc-eye { animation: kc-blink calc(4.5s / var(--speed)) ease-in-out infinite; transform-origin: center; }
          .kc-chest { animation: kc-purr calc(3s / var(--speed)) ease-in-out infinite; }
          .kc-tail { animation: kc-tail calc(2.8s / var(--speed)) ease-in-out infinite; }
          .kc-needle-left { animation: kc-knit-left calc(0.9s / var(--speed)) ease-in-out infinite; }
          .kc-needle-right { animation: kc-knit-right calc(0.9s / var(--speed)) ease-in-out infinite; }
          .kc-thread { stroke-dasharray: 8 6; animation: kc-thread calc(1s / var(--speed)) linear infinite; }
          .kc-bob { animation: kc-bob calc(2.2s / var(--speed)) ease-in-out infinite; }
        `}</style>

        <svg viewBox="0 0 600 420" width={width} height={height} role="img" aria-label="A cozy cat knitting a sweater near a fireplace">
          {/* Background wall */}
          <rect x="0" y="0" width="600" height="420" fill="var(--bg)" />

          {/* Rug */}
          <ellipse cx="300" cy="384" rx="220" ry="26" fill="var(--rug)" opacity=".45" />

          {/* Fireplace */}
          <g transform="translate(40,110)">
            <rect x="0" y="0" width="160" height="170" rx="6" fill="var(--stone)"/>
            {/* mortars */}
            {Array.from({length:7}).map((_,r)=> (
              <line key={"mrow"+r} x1={8} x2={152} y1={10+r*24} y2={10+r*24} stroke="var(--mortar)" strokeWidth={2}/>
            ))}
            {Array.from({length:5}).map((_,c)=> (
              <line key={"mcol"+c} y1={8} y2={162} x1={16+c*28} x2={16+c*28} stroke="var(--mortar)" strokeWidth={2}/>
            ))}
            {/* hearth opening */}
            <rect x="24" y="56" width="112" height="92" rx="6" fill="#111"/>
            {/* flames */}
            <g transform="translate(80,110)">
              <path className="kc-anim kc-fire kc-pivot" d="M0 0c18-20 24-44 0-58 -24 14 -18 38 0 58z" fill="var(--flame2)" opacity=".9"/>
              <path className="kc-anim kc-fire kc-pivot" d="M0 0c14-16 20-34 0-46 -20 12 -14 30 0 46z" fill="var(--flame1)"/>
              <path className="kc-anim kc-fire kc-pivot" d="M0 0c10-12 14-26 0-34 -14 8 -10 22 0 34z" fill="var(--flame3)"/>
            </g>
            {/* logs */}
            <rect x="34" y="128" width="92" height="8" rx="4" fill="var(--wood)"/>
            <rect x="40" y="120" width="92" height="8" rx="4" fill="var(--wood)" transform="rotate(4 86 124)"/>
          </g>

          {/* Chair */}
          <g transform="translate(380,150)">
            <rect x="0" y="24" width="160" height="120" rx="12" fill="var(--chair)"/>
            <rect x="16" y="0" width="128" height="40" rx="10" fill="var(--chair)"/>
          </g>

          {/* Yarn ball + trailing thread */}
          <g transform="translate(240,350)">
            <path className="kc-thread kc-anim" d="M0 0 C 40 -10, 90 -32, 130 -22" stroke="var(--thread)" strokeWidth="3" fill="none" />
          </g>
          <g transform="translate(224,346)" className="kc-bob kc-anim">
            <circle r="16" fill="var(--yarn)" stroke="var(--stroke)" />
            <path d="M-10,-4 a12,12 0 0 1 20,0" stroke="#0003" fill="none" />
            <path d="M-12,2 a12,12 0 0 0 24,0" stroke="#0003" fill="none" />
          </g>

          {/* Cat */}
          <g transform="translate(300,240)">
            {/* Tail */}
            <g transform="translate(120,80)" className="kc-tail kc-anim kc-pivot">
              <path d="M0 0 c 30 10, 40 30, 10 44 c -26 12 -44 -6 -40 -20 c 4 -16 18 -18 30 -24" fill="var(--fur)" stroke="var(--stroke)" />
            </g>

            {/* Body + sweater */}
            <g className="kc-chest kc-anim kc-pivot">
              <ellipse cx="0" cy="60" rx="90" ry="70" fill="var(--sweater)" stroke="var(--stroke)" />
              {/* sweater ribbing */}
              {Array.from({length:15}).map((_,i)=> (
                <line key={i} x1={-75 + i*10} y1={108} x2={-70 + i*10} y2={20} stroke="#0002" />
              ))}
              {/* arms */}
              <ellipse cx="-50" cy="40" rx="28" ry="22" fill="var(--sweater)" stroke="var(--stroke)" />
              <ellipse cx="50" cy="40" rx="28" ry="22" fill="var(--sweater)" stroke="var(--stroke)" />
            </g>

            {/* Head */}
            <g transform="translate(0,-10)">
              <circle cx="0" cy="0" r="48" fill="var(--fur)" stroke="var(--stroke)" />
              {/* inner face shading */}
              <ellipse cx="0" cy="6" rx="38" ry="32" fill="var(--fur-dark)" opacity=".25" />
              <ellipse cx="0" cy="18" rx="32" ry="20" fill="#fff" opacity=".15" />
              
              {/* ears with inner pink */}
              <path d="M-38,-12 l-22,-20 l8,28 z" fill="var(--fur)" stroke="var(--stroke)" />
              <path d="M38,-12 l22,-20 l-8,28 z" fill="var(--fur)" stroke="var(--stroke)" />
              <path d="M-42,-18 l-12,-8 l4,16 z" fill="#ffb3ba" opacity=".6" />
              <path d="M42,-18 l12,-8 l-4,16 z" fill="#ffb3ba" opacity=".6" />
              
              {/* eye highlights and better shape */}
              <g transform="translate(-16,-2)">
                <ellipse cx="0" cy="0" rx="8" ry="6" fill="#fff" opacity=".3" />
                <ellipse cx="0" cy="2" rx="6" ry="4" fill="var(--eye)" className="kc-eye kc-anim" />
                <ellipse cx="-2" cy="0" rx="2" ry="2" fill="#fff" opacity=".8" />
              </g>
              <g transform="translate(16,-2)">
                <ellipse cx="0" cy="0" rx="8" ry="6" fill="#fff" opacity=".3" />
                <ellipse cx="0" cy="2" rx="6" ry="4" fill="var(--eye)" className="kc-eye kc-anim" />
                <ellipse cx="-2" cy="0" rx="2" ry="2" fill="#fff" opacity=".8" />
              </g>
              
              {/* improved nose */}
              <path d="M-4,10 Q0,8 4,10 Q2,14 0,15 Q-2,14 -4,10 z" fill="var(--nose)" stroke="#0002" />
              <ellipse cx="0" cy="11" rx="2" ry="1" fill="#fff" opacity=".4" />
              
              {/* better mouth */}
              <path d="M0,16 Q-8,20 -16,18" stroke="#0004" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M0,16 Q8,20 16,18" stroke="#0004" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M0,16 Q0,22 0,24" stroke="#0004" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              
              {/* whiskers with better positioning */}
              <path d="M-12,8 h-24" stroke="#0004" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M-10,14 h-26" stroke="#0004" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M-8,20 h-22" stroke="#0004" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12,8 h24" stroke="#0004" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10,14 h26" stroke="#0004" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8,20 h22" stroke="#0004" strokeWidth="1.5" strokeLinecap="round" />
              
              {/* cheek blush */}
              <ellipse cx="-28" cy="8" rx="6" ry="4" fill="#ffb3ba" opacity=".3" />
              <ellipse cx="28" cy="8" rx="6" ry="4" fill="#ffb3ba" opacity=".3" />
            </g>

            {/* Needles & fabric */}
            <g transform="translate(0,52)">
              {/* fabric being knit */}
              <path d="M-46,18 q46,30 92,0 v24 h-92z" fill="var(--yarn)" opacity=".9" stroke="var(--stroke)" />

              {/* left needle */}
              <g transform="translate(-30,0)" className="kc-needle-left kc-anim kc-pivot">
                <rect x="-60" y="-2" width="80" height="4" rx="2" fill="#c9c9c9" stroke="#0003" />
                <circle cx="22" cy="0" r="3" fill="#aaa" />
              </g>

              {/* right needle */}
              <g transform="translate(30,0)" className="kc-needle-right kc-anim kc-pivot">
                <rect x="-20" y="-2" width="80" height="4" rx="2" fill="#c9c9c9" stroke="#0003" />
                <circle cx="62" cy="0" r="3" fill="#aaa" />
              </g>

              {/* thread from fabric to yarn ball (connects to global thread) */}
              <path d="M46,18 C 70,28 102,18 130,-12" stroke="var(--thread)" strokeWidth={3} fill="none" className="kc-thread kc-anim"/>
            </g>
          </g>
        </svg>
      </div>
    );
  }
);

export default KnittingCat;
export { KnittingCat };
