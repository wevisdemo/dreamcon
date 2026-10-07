import type { ReactNode } from 'react';
import { ChevronsLeftIcon } from '../../icons/chevrons-left';
import { Button } from '../button';
import { Tabs } from '../tabs';

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
    <div
      className={`shrink-0 overflow-clip motion-safe:transition-[width] motion-safe:duration-300 ${isOpen ? 'md:w-106' : 'md:w-0'}`}
    >
      <aside
        inert={!isOpen}
        className={`fixed inset-0 z-20 flex flex-col gap-1.25 bg-blue-1 p-2.5 motion-safe:transition-[translate,visibility] motion-safe:duration-300 md:sticky md:top-19 md:z-auto md:h-[calc(100dvh-(--spacing(24)))] md:w-101 md:rounded-xl ${isOpen ? '' : 'invisible -translate-x-full'}`}
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
      </aside>
    </div>
  );
}
