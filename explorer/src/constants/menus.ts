import type { LinkProps } from '@tanstack/react-router';

export const menus: { label: string; to: LinkProps['to'] }[] = [
  { label: 'ข้อถกเถียง', to: '/dashboard' },
  { label: 'Design system', to: '/design-system' },
];
