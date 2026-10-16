import { Link } from '@tanstack/react-router';
import { ChevronDownIcon } from '../../icons/chevron-down';
import type { CategorySummary } from '../../utils/category';

export function CategoryCard({ category, count, groups }: CategorySummary) {
  return (
    <div className="flex h-full w-55 flex-col gap-1 rounded-3xl bg-white p-2.5 md:w-80">
      <Link
        to="/dashboard"
        search={{ category: { category } }}
        className="flex items-start gap-2 rounded-[15px] py-3.75 pr-2.5 pl-5 hover:bg-blue-2"
      >
        <span className="flex-1 text-b5 font-bold">{category}</span>
        <div className="flex flex-row items-center gap-1">
          <span className="text-b7 text-blue-7">{count} ข้อถกเถียง</span>
          <ChevronDownIcon className="size-5 -rotate-90 text-blue-7" />
        </div>
      </Link>
      <p className="px-5 pt-1 text-b7 text-gray-5">ตัวอย่างประเด็นย่อย</p>
      {groups.map(({ id, phrase, count }) => (
        <Link
          key={id}
          to="/dashboard"
          search={{ category: { category, groupId: id } }}
          className="flex items-start gap-2 rounded-[15px] py-2.5 pr-2.5 pl-5 hover:bg-blue-2"
        >
          <span className="flex-1 text-b6 text-gray-8">{phrase}</span>
          <div className="flex flex-row items-center gap-1">
            <span className="text-b7 text-blue-7">{count}</span>
            <ChevronDownIcon className="size-5 -rotate-90 text-blue-7" />
          </div>
        </Link>
      ))}
    </div>
  );
}
