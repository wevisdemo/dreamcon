import React, { useState } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import KeyboardArrowDownIcon from '@material-symbols/svg-700/rounded/keyboard_arrow_down.svg?react';
import CheckIcon from '@material-symbols/svg-700/rounded/check.svg?react';

interface DropdownProps {
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  disabledOptions?: string[];
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onChange,
  disabledOptions = [],
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  /** Anything already selected stays listed, so a retired option can still be unticked. */
  const items = [...new Set([...options, ...selected])];

  /** Never disable what is already ticked, or it could not be unticked again. */
  const isDisabled = (option: string) =>
    disabledOptions.includes(option) && !selected.includes(option);

  const toggle = (option: string) =>
    onChange(
      selected.includes(option)
        ? selected.filter(s => s !== option)
        : [...selected, option]
    );

  const label =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0]
        : `${selected[0]} +${selected.length - 1}`;

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div className="dropdown relative z-30 w-full">
        <button
          className="dropdown-toggle flex justify-between gap-1 bg-blue-6 px-4 py-2.5 rounded-full text-white w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">{label}</span>
          <KeyboardArrowDownIcon
            className="w-4 h-4 shrink-0 self-center hover:cursor-pointer"
            aria-hidden
          />
        </button>
        {isOpen && (
          <ul className="dropdown-menu absolute top-full left-0 bg-white w-full border border-gray-3 text-blue-7 rounded-xl overflow-y-auto max-h-72">
            {items.map(option => (
              <li
                key={option}
                className={`dropdown-item ${
                  isDisabled(option) ? 'text-gray-4' : 'hover:bg-gray-1'
                }`}
              >
                <label
                  className={`flex gap-2 items-center px-4 py-2 ${
                    isDisabled(option)
                      ? 'hover:cursor-not-allowed'
                      : 'hover:cursor-pointer'
                  }`}
                >
                  <span className="relative flex shrink-0">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-3 h-3 rounded-sm bg-transparent border-[1.5px] border-blue-7 checked:bg-blue-7 disabled:border-gray-4"
                      checked={selected.includes(option)}
                      disabled={isDisabled(option)}
                      onChange={() => toggle(option)}
                    />
                    <CheckIcon
                      className="hidden peer-checked:block absolute inset-0 w-3 h-3 text-white pointer-events-none"
                      aria-hidden
                    />
                  </span>
                  <span className="truncate">{option}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default Dropdown;
