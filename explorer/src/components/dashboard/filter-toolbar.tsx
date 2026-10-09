import { useState } from 'react';
import type { Event } from '../../data/events';
import type { CategoryQuestions } from '../../data/group-questions';
import { CloseIcon } from '../../icons/close';
import { DownloadIcon } from '../../icons/download';
import {
  formatCategorySelection,
  formatEventSelection,
  type CategorySelection,
  type EventSelection,
} from '../../utils/filter';
import { Button } from '../button';
import { DownloadModal } from '../download-modal';
import { FilterTag } from '../filter-tag';
import { SearchBar } from '../search-bar';
import type { FilterTab } from './filter-sidebar';

export function FilterToolbar({
  categories,
  events,
  keyword,
  searchResetKey,
  categorySelection,
  eventSelection,
  expandedTab,
  onSearch,
  onToggle,
  onClear,
}: {
  categories: CategoryQuestions[];
  events: Pick<Event, 'id' | 'displayName'>[];
  keyword: string;
  searchResetKey: number;
  categorySelection?: CategorySelection;
  eventSelection?: EventSelection;
  expandedTab?: FilterTab;
  onSearch: (keyword: string) => void;
  onToggle: (tab: FilterTab) => void;
  onClear: () => void;
}) {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const filterButtons: {
    tab: FilterTab;
    label?: string;
    placeholder: string;
  }[] = [
    {
      tab: 'category',
      label:
        categorySelection &&
        formatCategorySelection(categories, categorySelection),
      placeholder: 'ทุกหมวดหมู่',
    },
    {
      tab: 'event',
      label:
        eventSelection &&
        `${'targetGroupTypes' in eventSelection ? 'ทุกวงที่มี ' : ''}${formatEventSelection(events, eventSelection)}`,
      placeholder: 'ทุกวงสนทนา',
    },
  ];

  return (
    <div className="pb-3 md:sticky md:top-14 md:z-10 md:-mt-5 md:bg-blue-3 md:pt-5">
      <div className="flex flex-row flex-wrap justify-start gap-3 rounded-2xl bg-blue-1 p-3 md:p-4 lg:flex-nowrap">
        <SearchBar
          key={searchResetKey}
          defaultValue={keyword}
          onSearch={query => onSearch(query.trim())}
          className="w-full shrink-0 md:w-auto"
        />
        <div className="contents lg:grid lg:min-w-0 lg:grid-cols-[repeat(2,minmax(0,max-content))] lg:gap-3">
          {filterButtons.map(({ tab, label, placeholder }) => (
            <FilterTag
              key={tab}
              size="large"
              variant={label ? 'primary' : 'secondary'}
              aria-expanded={expandedTab === tab}
              onClick={() => onToggle(tab)}
              className="w-full max-w-full min-w-0 md:w-auto [&>span]:truncate"
            >
              {label ?? placeholder}
            </FilterTag>
          ))}
        </div>
        {(keyword || categorySelection || eventSelection) && (
          <Button
            variant="tertiary-gray"
            icon={<CloseIcon />}
            onClick={onClear}
          >
            ล้างตัวกรอง
          </Button>
        )}
        <Button
          variant="tertiary-blue"
          icon={<DownloadIcon />}
          onClick={() => setIsDownloadModalOpen(true)}
          className="ml-auto"
        >
          ดาวน์โหลดข้อมูล
        </Button>
      </div>
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
