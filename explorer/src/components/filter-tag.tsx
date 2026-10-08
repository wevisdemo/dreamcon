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
  as = 'button',
  variant = 'secondary',
  size = 'small',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button' | 'span';
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}) {
  const tagClassName = `inline-flex shrink-0 items-center justify-center rounded-full ${variants[variant]} ${sizes[size]} ${className}`;
  const content = <span>{children}</span>;

  return as === 'span' ? (
    <span className={`pointer-events-none ${tagClassName}`}>{content}</span>
  ) : (
    <button
      type="button"
      className={`cursor-pointer ${tagClassName}`}
      {...props}
    >
      {content}
    </button>
  );
}
