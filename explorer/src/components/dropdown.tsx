import type { SelectHTMLAttributes } from 'react';
import { ChevronDownIcon } from '../icons/chevron-down';

export function Dropdown({
  options,
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
}) {
  return (
    <div className={`group relative inline-grid min-w-45 ${className}`}>
      {options.map(({ value, label }) => (
        <span
          key={value}
          aria-hidden
          className="invisible col-start-1 row-start-1 h-0 pr-7 pl-3 text-b7 whitespace-nowrap"
        >
          {label}
        </span>
      ))}
      <select
        className="col-start-1 row-start-1 flex h-7 w-full cursor-pointer appearance-none items-center truncate rounded-[10px] bg-blue-1 pr-7 pl-3 text-b7 text-gray-8 outline-offset-2 hover:bg-white supports-[appearance:base-select]:[appearance:base-select] [&::picker(select)]:my-1.25 [&::picker(select)]:w-max [&::picker(select)]:min-w-[anchor-size(width)] [&::picker(select)]:[appearance:base-select] [&::picker(select)]:rounded-[10px] [&::picker(select)]:border-0 [&::picker(select)]:bg-white [&::picker(select)]:shadow-[3px_7px_17.2px_#0000001a] [&::picker(select)]:[position-try-order:normal] [&::picker-icon]:hidden [&:open]:bg-white"
        {...props}
      >
        {options.map(({ value, label }) => (
          <option
            key={value}
            value={value}
            className="px-3 py-1.5 text-b7 text-gray-8 hover:bg-gray-2 focus-visible:bg-gray-2 [&::checkmark]:hidden"
          >
            {label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 size-4.5 -translate-y-1/2 text-gray-6 transition-transform duration-150 group-has-[select:open]:rotate-180" />
    </div>
  );
}
