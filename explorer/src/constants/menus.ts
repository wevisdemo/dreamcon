import type { LinkProps } from '@tanstack/react-router';

export const menus: { label: string; to: LinkProps['to'] }[] = [
  { label: 'ข้อถกเถียง', to: '/dashboard' },
  { label: 'เกี่ยวกับเรา', to: '/about' },
];
