import { useState } from 'react';

interface PropTypes {
  onClick: () => void;
  isSelected?: boolean;
  count: number;
}

export default function DefaultFilterEvent(props: PropTypes) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex h-28 flex-col items-center justify-end"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <div
        className={`flex h-18.75 w-18.75 cursor-pointer items-center justify-center rounded-full ${
          !props.isSelected && hovered ? 'border-2 border-gray-8' : ''
        } ${
          props.isSelected ? 'bg-blue-6 text-white' : 'bg-blue-1 text-blue-5'
        }`}
        onClick={() => props.onClick()}
      >
        <span className="wv-bold text-b1">{props.count}</span>
      </div>
      <p
        className={`px-1.25 py-0.75 text-center text-label-sm whitespace-nowrap text-gray-5 ${
          props.isSelected
            ? 'wv-semibold rounded-full bg-blue-6 text-white'
            : ''
        }`}
      >
        จากทุกวงสนทนา
      </p>
    </div>
  );
}
