import type { SVGProps } from 'react';

const chevron =
  'M5 2.65L1.85 5.79C1.65 6 1.39 6.1 1.08 6.1C0.78 6.1 0.52 6 0.31 5.79C0.1 5.58 0 5.33 0 5.02C0 4.72 0.1 4.46 0.31 4.25L4.23 0.33C4.45 0.11 4.71 0 5 0C5.29 0 5.55 0.11 5.77 0.33L9.69 4.25C9.9 4.46 10 4.72 10 5.02C10 5.33 9.9 5.58 9.69 5.79C9.48 6 9.22 6.1 8.92 6.1C8.61 6.1 8.35 6 8.15 5.79L5 2.65Z';

export function ChevronsLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path transform="translate(5.3 17) rotate(-90)" d={chevron} />
      <path transform="translate(11.95 17) rotate(-90)" d={chevron} />
    </svg>
  );
}
