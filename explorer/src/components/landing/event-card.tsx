import { Link } from '@tanstack/react-router';
import { EVENT_DATE_FORMAT } from '../../constants/event';
import { ChevronDownIcon } from '../../icons/chevron-down';
import { LocationIcon } from '../../icons/location';
import { PersonIcon } from '../../icons/person';
import { FilterTag } from '../filter-tag';

export type EventCardData = {
  id: string;
  displayName: string;
  date: Date;
  location: string;
  participantCount: number;
  targetGroupTypes: string[];
  topicCount: number;
};

export function EventCard({
  id,
  displayName,
  date,
  location,
  participantCount,
  targetGroupTypes,
  topicCount,
}: EventCardData) {
  return (
    <Link
      to="/dashboard"
      search={{ event: { eventId: id } }}
      className="flex h-full w-55 flex-col items-center gap-2.5 rounded-[20px] bg-white px-7.5 py-5 hover:bg-blue-2 md:w-80"
    >
      <span className="w-full text-b7 text-gray-6">
        {EVENT_DATE_FORMAT.format(date)}
      </span>
      <span className="w-full text-b5 font-bold">{displayName}</span>
      <span className="flex w-full gap-1 text-b7 text-gray-6">
        <LocationIcon className="size-4.5 shrink-0" />
        <span className="flex-1">{location}</span>
      </span>
      <span className="flex w-full gap-1 text-b7 text-gray-6">
        <PersonIcon className="size-4.5 shrink-0" />
        <span className="flex flex-1 flex-wrap items-center gap-0.5">
          {targetGroupTypes.map(type => (
            <FilterTag key={type} as="span">
              {type}
            </FilterTag>
          ))}
          <span>{participantCount} คน</span>
        </span>
      </span>
      <span className="mt-auto flex items-center gap-1.75 self-end text-b7 text-blue-7">
        {topicCount} ข้อถกเถียง
        <ChevronDownIcon className="size-5 -rotate-90" />
      </span>
    </Link>
  );
}
