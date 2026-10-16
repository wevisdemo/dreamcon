import { Link } from '@tanstack/react-router';
import { ChevronDownIcon } from '../../icons/chevron-down';

export type DemographicCardData = { type: string; eventCount: number };

export function DemographicCard({ type, eventCount }: DemographicCardData) {
  return (
    <Link
      to="/dashboard"
      search={{ event: { targetGroupTypes: [type] } }}
      className="flex items-center gap-2.5 rounded-full border-2 border-transparent bg-white pt-2.5 pr-5 pb-2 pl-7 text-blue-7 hover:bg-blue-2"
    >
      <span className="flex flex-col">
        <span className="text-b6 font-bold">{type}</span>
        <span className="text-b7">{eventCount} วงสนทนา</span>
      </span>
      <ChevronDownIcon className="size-5 -rotate-90" />
    </Link>
  );
}
