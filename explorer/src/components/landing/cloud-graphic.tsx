import type { CSSProperties } from 'react';

const WIDE_BARS = (
  <>
    <rect y="33.08" width="192.69" height="33.08" rx="16.54" />
    <rect x="20.26" width="123.22" height="36.39" rx="18.19" />
  </>
);

const CLOUD_VARIANTS = {
  wide: { viewBox: '0 0 192.69 66.16', shape: WIDE_BARS },
  triple: {
    viewBox: '0 0 192.69 99.24',
    shape: (
      <>
        {WIDE_BARS}
        <rect x="71.12" y="62.85" width="79.39" height="36.39" rx="18.19" />
      </>
    ),
  },
  dripping: {
    viewBox: '0 0 192.69 66.16',
    shape: (
      <path d="M16.54 0C7.41 0 0 7.41 0 16.54C0 25.67 7.41 33.08 16.54 33.08L38.55 33.08C39.76 33.08 40.35 34.77 39.53 35.66C36.55 38.9 34.73 43.22 34.73 47.97C34.73 58.01 42.88 66.16 52.93 66.16L139.76 66.16C149.81 66.16 157.96 58.01 157.96 47.97C157.96 43.22 156.14 38.9 153.16 35.66C152.34 34.77 152.93 33.08 154.14 33.08L176.15 33.08C185.29 33.08 192.69 25.67 192.69 16.54C192.69 7.41 185.29 0 176.15 0L16.54 0Z" />
    ),
  },
  pill: {
    viewBox: '0 0 192.69 66.16',
    shape: (
      <path d="M19 14.08H125A19 19 0 0 1 125 52.08H16A16 16 0 0 1 0 36.08V33.08A19 19 0 0 1 19 14.08Z" />
    ),
  },
};

/** Negative delay starts a cloud partway across, `progress` (0-1) of the trip. */
const driftStyle = (duration: number, progress: number): CSSProperties => ({
  animationDuration: `${duration}s`,
  animationDelay: `${-duration * progress}s`,
});

function Cloud({
  variant,
  className,
  style,
}: {
  variant: keyof typeof CLOUD_VARIANTS;
  className: string;
  style: CSSProperties;
}) {
  const { viewBox, shape } = CLOUD_VARIANTS[variant];

  return (
    <svg
      viewBox={viewBox}
      fill="currentColor"
      style={style}
      className={`absolute left-0 w-24 animate-drift text-blue-2 motion-reduce:[animation-play-state:paused] md:w-48 ${className}`}
    >
      {shape}
    </svg>
  );
}

export function CloudGraphic() {
  return (
    <div aria-hidden className="@container absolute inset-0">
      <Cloud
        variant="triple"
        className="top-3.75 md:top-15"
        style={driftStyle(70, 0.17)}
      />
      <Cloud
        variant="dripping"
        className="top-3.75 md:top-15"
        style={driftStyle(70, 0.83)}
      />
      <Cloud
        variant="dripping"
        className="top-[42%] hidden md:block"
        style={driftStyle(90, 0.3)}
      />
      <Cloud
        variant="triple"
        className="top-[42%] hidden md:block"
        style={driftStyle(90, 0.7)}
      />
      <Cloud
        variant="wide"
        className="bottom-3.75 md:bottom-15"
        style={driftStyle(55, 0.17)}
      />
      <Cloud
        variant="pill"
        className="bottom-3.75 md:bottom-15"
        style={driftStyle(55, 0.88)}
      />
    </div>
  );
}
