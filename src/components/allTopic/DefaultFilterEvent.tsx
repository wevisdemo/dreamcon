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
      className="flex flex-col items-center h-28 justify-end"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <div
        className={`w-18.75 h-18.75 rounded-full cursor-pointer flex items-center justify-center ${
          !props.isSelected && hovered ? 'border-2 border-gray-8' : ''
        } ${
          props.isSelected ? 'bg-blue-6 text-white' : 'bg-blue-1 text-blue-5'
        }`}
        onClick={() => props.onClick()}
      >
        <span className="text-b1 wv-bold">{props.count}</span>
      </div>
      <p
        className={`text-label-sm text-gray-5 px-1.25 py-0.75 text-center whitespace-nowrap ${
          props.isSelected
            ? 'bg-blue-6 rounded-full text-white wv-semibold'
            : ''
        }`}
      >
        จากทุกวงสนทนา
      </p>
    </div>
  );
}
