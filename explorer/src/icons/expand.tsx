import type { SVGProps } from 'react';

const chevron =
  'M4.84 2.56L1.79 5.6C1.59 5.8 1.34 5.91 1.05 5.91C0.75 5.91 0.5 5.8 0.3 5.6C0.1 5.4 0 5.15 0 4.86C0 4.56 0.1 4.31 0.3 4.11L4.09 0.32C4.31 0.11 4.56 0 4.84 0C5.12 0 5.37 0.11 5.58 0.32L9.37 4.11C9.57 4.31 9.67 4.56 9.67 4.86C9.67 5.15 9.57 5.4 9.37 5.6C9.17 5.8 8.92 5.91 8.63 5.91C8.33 5.91 8.08 5.8 7.88 5.6L4.84 2.56Z';

export function ExpandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <g transform="matrix(-1 0 0 1 24 0) translate(3.1 4)">
        <path
          transform="translate(7.12 8.2) rotate(135 4.84 2.95)"
          d={chevron}
        />
        <path
          transform="translate(0.67 2.56) rotate(-45 4.84 2.95)"
          d={chevron}
        />
      </g>
    </svg>
  );
}
