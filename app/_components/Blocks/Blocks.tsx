import type { CSSProperties } from 'react';

type BlocksProps = {
  height?: number | string;
  width?: number | string;
  color?: string;
  ariaLabel?: string;
  wrapperStyle?: CSSProperties;
  wrapperClass?: string;
  visible?: boolean;
};

// Ring positions (clockwise from top-left) of a 3x3 grid, center cell omitted.
const CELLS = [
  { x: 17, y: 17 },
  { x: 40, y: 17 },
  { x: 63, y: 17 },
  { x: 63, y: 40 },
  { x: 63, y: 63 },
  { x: 40, y: 63 },
  { x: 17, y: 63 },
  { x: 17, y: 40 },
];

const DUR = 0.8;

export function Blocks({
  height = 80,
  width = 80,
  color = '#bde153',
  ariaLabel = 'blocks-loading',
  wrapperStyle,
  wrapperClass,
  visible = true,
}: BlocksProps) {
  if (!visible) return null;

  const idle = 'rgba(189, 225, 83, 0.18)';
  const step = DUR / CELLS.length;

  return (
    <div
      style={wrapperStyle}
      className={wrapperClass}
      aria-label={ariaLabel}
      role="status"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        {CELLS.map((cell, index) => (
          <rect key={`${cell.x}-${cell.y}`} x={cell.x} y={cell.y} width="20" height="20" fill={idle}>
            <animate
              attributeName="fill"
              values={`${color};${idle};${idle}`}
              keyTimes="0;0.125;1"
              dur={`${DUR}s`}
              begin={`${index * step}s`}
              repeatCount="indefinite"
              calcMode="discrete"
            />
          </rect>
        ))}
      </svg>
    </div>
  );
}
