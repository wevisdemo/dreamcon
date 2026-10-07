import { useState } from 'react';
import type { Event } from '../../data/events';
import type { CategoryQuestions } from '../../data/group-questions';
import { CloseIcon } from '../../icons/close';
import {
  formatCategorySelection,
  formatEventSelection,
  type CategorySelection,
  type EventSelection,
} from '../../utils/filter';
import { Button } from '../button';
import { SearchBar } from '../search-bar';
import type { FilterTab } from './filter-sidebar';

export function FilterToolbar({
  categories,
  events,
  keyword,
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
  categorySelection?: CategorySelection;
  eventSelection?: EventSelection;
  expandedTab?: FilterTab;
  onSearch: (keyword: string) => void;
  onToggle: (tab: FilterTab) => void;
  onClear: () => void;
}) {
  const [searchBarKey, setSearchBarKey] = useState(0);

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
      <div className="flex flex-row flex-wrap justify-start gap-3 rounded-xl bg-blue-1 p-3 md:p-4 lg:flex-nowrap">
        <SearchBar
          key={searchBarKey}
          onSearch={query => onSearch(query.trim())}
          className="w-full shrink-0 md:w-auto"
        />
        {filterButtons.map(({ tab, label, placeholder }) => (
          <Button
            key={tab}
            variant={label ? 'primary-blue' : 'secondary'}
            aria-expanded={expandedTab === tab}
            onClick={() => onToggle(tab)}
            className="w-full max-w-full min-w-0 md:w-auto lg:shrink [&>span]:-my-1 [&>span]:truncate [&>span]:py-1"
          >
            {label ?? placeholder}
          </Button>
        ))}
        {(keyword || categorySelection || eventSelection) && (
          <Button
            variant="tertiary-gray"
            icon={<CloseIcon />}
            onClick={() => {
              setSearchBarKey(key => key + 1);
              onClear();
            }}
          >
            ล้างตัวกรอง
          </Button>
        )}
      </div>
    </div>
  );
}
