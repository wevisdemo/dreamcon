import type { ReactNode } from 'react';
import { ChevronsLeftIcon } from '../../icons/chevrons-left';
import { Button } from '../button';
import { Tabs } from '../tabs';
import { Sidebar } from './sidebar';

export type FilterTab = 'category' | 'event';

const tabs: { value: FilterTab; label: string }[] = [
  { value: 'category', label: 'หมวดหมู่' },
  { value: 'event', label: 'วงสนทนา' },
];

export function FilterSidebar({
  isOpen,
  tab,
  onTabChange,
  onClose,
  children,
}: {
  isOpen: boolean;
  tab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Sidebar
      isOpen={isOpen}
      side="left"
      className="gap-1.5 bg-blue-1 px-2.5 pt-2.5"
    >
      <div className="flex items-center">
        <div className="flex-1">
          <Tabs tabs={tabs} value={tab} onChange={onTabChange} />
        </div>
        <Button
          variant="icon-blue"
          icon={<ChevronsLeftIcon />}
          aria-label="ปิดตัวกรอง"
          onClick={onClose}
        />
      </div>
      {children}
    </Sidebar>
  );
}
