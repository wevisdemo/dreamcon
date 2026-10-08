import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

const variants = {
  'primary-blue': 'rounded-full bg-blue-7 text-white hover:bg-blue-8',
  'primary-gray': 'rounded-full bg-gray-3 text-gray-8 hover:bg-gray-4',
  'primary-white': 'rounded-full bg-white text-gray-8 hover:bg-blue-2',
  secondary:
    'rounded-full border-2 border-blue-4 text-blue-7 hover:text-blue-8',
  'tertiary-blue': 'text-blue-7 hover:text-blue-8',
  'tertiary-gray': 'text-gray-6 hover:text-gray-8',
  'tertiary-white': 'text-white hover:text-blue-3',
  'icon-blue': 'text-blue-7 hover:text-blue-8',
  'icon-white': 'text-white hover:text-blue-3',
};

const filledSizes = {
  large: `h-11 gap-1.25 px-5 text-b5 font-bold [&_svg]:size-4.5`,
  small: `h-7.5 gap-1.25 px-2.5 text-b6 font-bold [&_svg]:size-3.5`,
};

const sizes = {
  primary: filledSizes,
  secondary: filledSizes,
  tertiary: {
    large: 'gap-1 text-b6 underline [&_svg]:size-4',
    small: 'gap-1 text-b7 underline [&_svg]:size-3',
  },
  icon: {
    large: 'size-7 [&_svg]:size-6',
    small: 'size-5 [&_svg]:size-4',
  },
};

type Variant = keyof typeof variants;
type Size = 'large' | 'small';

const buttonClassName = (variant: Variant, size: Size) =>
  `inline-flex shrink-0 cursor-pointer items-center justify-center ${variants[variant]} ${sizes[variant.split('-')[0] as keyof typeof sizes][size]}`;

export function Button({
  variant,
  size = 'large',
  icon,
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: Variant;
  size?: Size;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${buttonClassName(variant, size)} ${className}`}
      {...props}
    >
      {icon}
      {children && <span>{children}</span>}
    </button>
  );
}

export function ButtonLink({
  variant,
  size = 'large',
  icon,
  className = '',
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant: Variant;
  size?: Size;
  icon?: ReactNode;
}) {
  return (
    <a className={`${buttonClassName(variant, size)} ${className}`} {...props}>
      {icon}
      {children && <span>{children}</span>}
    </a>
  );
}
