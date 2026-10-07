import type { ReactNode } from 'react';
import type { Conversation } from '../../data/conversations';
import type { Event } from '../../data/events';
import { CloseIcon } from '../../icons/close';
import { DocumentIcon } from '../../icons/document';
import { ShareIcon } from '../../icons/share';
import {
  formatEventSelection,
  getSelectedTargetGroupTypes,
  type EventSelection,
} from '../../utils/filter';
import { Button } from '../button';
import { FilterTag } from '../filter-tag';

const dateFormat = new Intl.DateTimeFormat('th-TH', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Bangkok',
});

export function FilterEvent({
  events,
  conversations,
  selection,
  onSelect,
}: {
  events: Event[];
  conversations: Pick<Conversation, 'eventIds'>[];
  selection?: EventSelection;
  onSelect: (selection?: EventSelection) => void;
}) {
  const targetGroupTypes = [
    ...new Set(events.flatMap(({ targetGroup }) => targetGroup.types)),
  ];

  const selectedTypes = getSelectedTargetGroupTypes(selection);

  const visibleEvents =
    selectedTypes.length > 0
      ? events.filter(({ targetGroup }) =>
          targetGroup.types.some(type => selectedTypes.includes(type))
        )
      : events;

  const toggleType = (type: string) => {
    const types = selectedTypes.includes(type)
      ? selectedTypes.filter(selectedType => selectedType !== type)
      : [...selectedTypes, type];
    onSelect(types.length > 0 ? { targetGroupTypes: types } : undefined);
  };

  const countTopics = (eventId: string) =>
    conversations.filter(({ eventIds }) => eventIds.includes(eventId)).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.25">
      <div className="flex flex-col px-2.5 pt-2.5">
        <p className="text-b6 font-bold text-gray-8">
          ทั้งหมด {events.length} วงสนทนา
        </p>
        {selection && (
          <>
            <p className="truncate text-b7 text-blue-7">
              กรองเฉพาะ: {formatEventSelection(events, selection)}
            </p>
            <Button
              variant="tertiary-gray"
              icon={<CloseIcon />}
              onClick={() => onSelect(undefined)}
              className="my-1 self-end"
            >
              ล้างวงสนทนา
            </Button>
          </>
        )}
      </div>
      <div className="flex min-h-0 scrollbar-thin [scrollbar-color:var(--color-blue-3)_transparent] flex-col gap-5 overflow-y-auto">
        {targetGroupTypes.length > 0 && (
          <section className="flex flex-col gap-2.5 px-2.5">
            <h3 className="text-b6 font-bold text-gray-6">
              เลือกจากลักษณะผู้เข้าร่วม ({targetGroupTypes.length})
            </h3>
            <div className="flex flex-wrap gap-1.25">
              {targetGroupTypes.map(type => {
                const isSelected = selectedTypes.includes(type);

                return (
                  <FilterTag
                    key={type}
                    size="medium"
                    variant={isSelected ? 'primary' : 'secondary'}
                    aria-pressed={isSelected}
                    onClick={() => toggleType(type)}
                  >
                    {type}
                  </FilterTag>
                );
              })}
            </div>
          </section>
        )}
        <section className="flex flex-col gap-1.25">
          <div className="flex flex-col px-2.5">
            <h3 className="text-b6 font-bold text-gray-6">
              เลือกจากวงสนทนา ({visibleEvents.length})
            </h3>
            <p className="text-b7 text-gray-6">เรียงตามวันที่จัด: ใหม่ไปเก่า</p>
          </div>
          <ul className="flex flex-col">
            {visibleEvents.map(event => {
              const isSelected =
                selection !== undefined &&
                'eventId' in selection &&
                selection.eventId === event.id;
              const details: [string, ReactNode][] = [
                ['ชื่อวงสนทนาฉบับเต็ม', event.title.en],
                ['สถานที่', event.location],
                ['ผู้เข้าร่วม', event.targetGroup.description],
                ['จำนวน', `${event.participantCount} คน`],
                ['รายละเอียด', event.description],
                [
                  'ผู้ร่วมจัดงาน',
                  event.organizers.length > 0 && (
                    <ul className="list-disc pl-5">
                      {event.organizers.map(organizer => (
                        <li key={organizer}>{organizer}</li>
                      ))}
                    </ul>
                  ),
                ],
              ];
              const links = [
                { label: 'ลิงก์ข่าว', href: event.newsLink, Icon: ShareIcon },
                {
                  label: 'เอกสารกิจกรรม',
                  href: event.documentLink,
                  Icon: DocumentIcon,
                },
              ].filter(({ href }) => href);

              return (
                <li
                  key={event.id}
                  className={`flex flex-col rounded-xl p-3.75 motion-safe:transition-colors motion-safe:duration-300 ${isSelected ? 'bg-blue-7' : 'border-b border-blue-3'}`}
                >
                  <button
                    type="button"
                    aria-expanded={isSelected}
                    onClick={() =>
                      onSelect(isSelected ? undefined : { eventId: event.id })
                    }
                    className="flex cursor-pointer flex-col gap-1.25 text-left"
                  >
                    <span
                      className={`text-b7 ${isSelected ? 'text-gray-3' : 'text-gray-6'}`}
                    >
                      {dateFormat.format(event.date)}
                    </span>
                    <span
                      className={`text-b5 font-bold ${isSelected ? 'text-white' : 'text-blue-7'}`}
                    >
                      {event.displayName}
                    </span>
                    {event.targetGroup.types.length > 0 && (
                      <span className="flex flex-wrap gap-0.5">
                        {event.targetGroup.types.map(type => (
                          <FilterTag
                            key={type}
                            as="span"
                            variant={
                              selectedTypes.includes(type)
                                ? 'primary'
                                : 'secondary'
                            }
                          >
                            {type}
                          </FilterTag>
                        ))}
                      </span>
                    )}
                    <span
                      className={`self-end text-b7 ${isSelected ? 'text-gray-3' : 'text-gray-6'}`}
                    >
                      {countTopics(event.id)} ข้อถกเถียง
                    </span>
                  </button>
                  <div
                    inert={!isSelected}
                    className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300 ${isSelected ? 'mt-2 grid-rows-[1fr] border-t border-blue-5' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <dl className="flex flex-col gap-2.5 pt-2.5 text-white">
                        {details
                          .filter(([, value]) => value)
                          .map(([label, value]) => (
                            <div key={label}>
                              <dt className="text-b7 font-bold">{label}</dt>
                              <dd className="whitespace-pre-line">{value}</dd>
                            </div>
                          ))}
                      </dl>
                      {links.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-x-3.75 pt-5">
                          {links.map(({ label, href, Icon }) => (
                            <a
                              key={label}
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-b6 text-white underline hover:text-blue-3"
                            >
                              <Icon className="size-3.5 text-blue-1" />
                              {label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
