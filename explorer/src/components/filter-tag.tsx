import type { ButtonHTMLAttributes } from 'react';

const variants = {
  primary: 'border-transparent bg-blue-7 text-white hover:bg-blue-8',
  secondary: 'border-blue-4 bg-blue-2 text-blue-7 hover:bg-blue-4',
};

const sizes = {
  large: 'h-9.5 border-2 px-5 text-b5 font-bold',
  medium: 'h-7 border-1 px-2.5 text-b6',
  small: 'h-6 px-1.25 text-b7',
};

export function FilterTag({
  variant = 'secondary',
  size = 'small',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}) {
  return (
    <button
      type="button"
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="[text-box:trim-both_cap_alphabetic]">{children}</span>
    </button>
  );
}
