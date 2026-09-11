import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@material-symbols/svg-700/rounded/keyboard_arrow_down.svg?react';

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown relative w-29 z-30">
      <button
        className="dropdown-toggle flex justify-between gap-1 bg-blue-6 px-3 py-1.25 rounded-full text-white w-29"
        onClick={handleToggle}
      >
        <span className="truncate">{selectedOption || placeholder}</span>
        <KeyboardArrowDownIcon
          className="w-4 h-4 shrink-0 self-center hover:cursor-pointer"
          aria-hidden
        />
      </button>
      {isOpen && (
        <ul className="dropdown-menu absolute top-full left-0 bg-white w-29 border border-gray-3 text-blue-7 rounded-xl overflow-hidden">
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown-item px-4 py-1.5 hover:bg-gray-1 hover:cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
