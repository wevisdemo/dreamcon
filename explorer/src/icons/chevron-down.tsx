import type { SVGProps } from 'react';

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden {...props}>
      <path
        transform="translate(4.52, 5.91)"
        d="M4.5 5.48C4.36 5.48 4.24 5.45 4.13 5.41C4.01 5.37 3.91 5.29 3.81 5.19L0.28 1.67C0.09 1.48 0 1.25 0 0.98C0 0.7 0.09 0.47 0.28 0.28C0.47 0.09 0.7 0 0.98 0C1.25 0 1.48 0.09 1.67 0.28L4.5 3.11L7.33 0.28C7.52 0.09 7.75 0 8.02 0C8.3 0 8.53 0.09 8.72 0.28C8.91 0.47 9 0.7 9 0.98C9 1.25 8.91 1.48 8.72 1.67L5.19 5.19C5.09 5.29 4.99 5.37 4.88 5.41C4.76 5.45 4.64 5.48 4.5 5.48Z"
      />
    </svg>
  );
}
