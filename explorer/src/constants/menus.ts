import type { LinkProps } from '@tanstack/react-router';

export const menus: { label: string; to: LinkProps['to'] }[] = [
  { label: 'หน้าแรก', to: '/' },
  { label: 'Design system', to: '/design-system' },
];
