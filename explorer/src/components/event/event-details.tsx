import type { ReactNode } from 'react';
import type { Event } from '../../data/events';
import { DocumentIcon } from '../../icons/document';
import { ShareIcon } from '../../icons/share';

const variants = {
  light: {
    details: 'text-gray-8',
    link: 'text-gray-6 hover:text-gray-8',
    icon: '',
  },
  dark: {
    details: 'text-white',
    link: 'text-white hover:text-blue-3',
    icon: 'text-blue-1',
  },
};

export function EventDetails({
  event,
  variant = 'light',
  className = '',
}: {
  event: Event;
  variant?: keyof typeof variants;
  className?: string;
}) {
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
    { label: 'เอกสารกิจกรรม', href: event.documentLink, Icon: DocumentIcon },
  ].filter(({ href }) => href);

  return (
    <div className={className}>
      <dl className={`flex flex-col gap-2.5 ${variants[variant].details}`}>
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
        <div className="flex flex-wrap justify-end gap-x-3 pt-2">
          {links.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-1 text-b6 underline ${variants[variant].link}`}
            >
              <Icon className={`size-3.5 ${variants[variant].icon}`} />
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
