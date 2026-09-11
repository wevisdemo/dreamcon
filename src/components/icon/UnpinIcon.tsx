import type { SVGProps } from 'react';
import PinIcon from './PinIcon';

export default function UnpinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <PinIcon {...props}>
      <path
        d="M4 4L20 20"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </PinIcon>
  );
}
