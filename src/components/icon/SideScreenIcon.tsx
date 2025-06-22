interface PropTypes {
  className?: string;
  color?: string;
}

export default function SideScreenIcon(props: PropTypes) {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_2197_7663"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2197_7663)">
        <rect
          x="4"
          y="6.5"
          width="16"
          height="12"
          rx="1.6"
          stroke={props.color || '#2579F5'}
          strokeWidth="1.6"
        />
        <rect
          x="12"
          y="8.1001"
          width="6.4"
          height="8.8"
          rx="0.8"
          fill={props.color || '#2579F5'}
        />
      </g>
    </svg>
  );
}
