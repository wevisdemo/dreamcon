import type { Conversation } from '../../data/conversations';
import type { CategoryQuestions } from '../../data/group-questions';
import { useScrollIntoView } from '../../hooks/use-scroll-into-view';
import { ChevronDownIcon } from '../../icons/chevron-down';
import {
  formatCategorySelection,
  summarizeCategories,
  type CategorySelection,
} from '../../utils/filter';
import { FilterHeader } from './filter-header';

export function FilterCategory({
  categories,
  conversations,
  selection,
  onSelect,
}: {
  categories: CategoryQuestions[];
  conversations: Pick<Conversation, 'groups'>[];
  selection?: CategorySelection;
  onSelect: (selection?: CategorySelection) => void;
}) {
  const selectedRef = useScrollIntoView(
    selection?.groupId ?? selection?.category
  );

  const sortedCategories = summarizeCategories(categories, conversations);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.25">
      <FilterHeader
        title={`ทั้งหมด ${categories.length} หมวด`}
        selectionLabel={
          selection && formatCategorySelection(categories, selection)
        }
        clearLabel="ล้างหมวดหมู่"
        onClear={() => onSelect(undefined)}
      />
      <ul className="flex min-h-0 scrollbar-thin scrollbar-thumb-blue-3 flex-col overflow-y-auto pb-2.5 motion-safe:scroll-smooth">
        {sortedCategories.map(({ category, count, groups }) => {
          const isExpanded = selection?.category === category;
          const isHighlighted = isExpanded && selection.groupId === undefined;

          return (
            <li
              key={category}
              ref={isHighlighted ? selectedRef : undefined}
              className={`relative flex flex-col rounded-lg motion-safe:transition-colors motion-safe:duration-300 ${isHighlighted ? 'bg-blue-7' : 'after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-blue-3'}`}
            >
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() =>
                  onSelect(isHighlighted ? undefined : { category })
                }
                className={`flex cursor-pointer items-end justify-between gap-1.25 rounded-lg px-2.5 py-3 text-left ${isHighlighted ? '' : 'hover:bg-blue-3'}`}
              >
                <span
                  className={`flex flex-1 items-center text-b5 font-bold ${isHighlighted ? 'text-white' : 'text-blue-7'}`}
                >
                  <ChevronDownIcon
                    className={`size-6 shrink-0 motion-safe:transition-transform motion-safe:duration-300 ${isExpanded ? '' : '-rotate-90'}`}
                  />
                  {category}
                </span>
                <span
                  className={`text-b7 ${isHighlighted ? 'text-gray-3' : 'text-gray-6'}`}
                >
                  {count} ข้อถกเถียง
                </span>
              </button>
              <div
                inert={!isExpanded}
                className={`grid px-2.5 motion-safe:transition-[grid-template-rows] motion-safe:duration-300 ${isExpanded ? 'grid-rows-[1fr] pb-3' : 'grid-rows-[0fr]'}`}
              >
                <div className="flex flex-col gap-1.5 overflow-hidden">
                  <p
                    className={`pt-3 text-b7 ${isHighlighted ? 'text-blue-3' : 'text-gray-6'}`}
                  >
                    {groups.length} กลุ่มประเด็น สรุปโดย AI
                  </p>
                  {groups.map(({ id, phrase, count }) => {
                    const isSelected = isExpanded && selection.groupId === id;

                    return (
                      <button
                        key={id}
                        ref={isSelected ? selectedRef : undefined}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          onSelect(
                            isSelected
                              ? { category }
                              : { category, groupId: id }
                          )
                        }
                        className={`flex cursor-pointer items-start gap-1 rounded-md p-2.5 text-left ${isSelected ? 'bg-blue-7' : 'bg-blue-1 hover:bg-blue-2'}`}
                      >
                        <span
                          className={`flex-1 text-b6 ${isSelected ? 'text-white' : 'text-blue-7'}`}
                        >
                          {phrase}
                        </span>
                        <span
                          className={`mt-px text-b7 ${isSelected ? 'text-gray-3' : 'text-gray-6'}`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
