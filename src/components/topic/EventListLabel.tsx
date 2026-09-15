import { useContext } from 'react';
import DeleteIcon from '@material-symbols/svg-700/rounded/delete.svg?react';
import { StoreContext } from '../../store';

interface PropTypes {
  label: string;
  eventIds: string[];
  activeEventId?: string;
  canLeave?: boolean;
  onLeave: () => void;
  className?: string;
  color?: 'blue' | 'gray';
}

export default function EventListLabel(props: PropTypes) {
  const { event: eventContext } = useContext(StoreContext);

  const eventDisplayName = (eventId: string) =>
    eventContext.events.find(event => event.id === eventId)?.display_name ??
    eventId;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-label-sm ${props.color === 'gray' ? 'text-gray-5' : 'text-blue-7'} ${props.className}`}
    >
      <span>{props.label}</span>
      {props.eventIds.map((eventId, index) => {
        const isActiveEvent = eventId === props.activeEventId;
        return (
          <span key={eventId} className="flex items-center gap-2">
            {index > 0 && <span>|</span>}
            <span
              className={`flex flex-row items-center gap-1 font-bold underline ${isActiveEvent ? 'text-black' : ''}`}
            >
              {eventDisplayName(eventId)}
              {props.canLeave && isActiveEvent && (
                <button
                  onClick={props.onLeave}
                  className="px-1"
                  aria-label="ถอนวงของฉันออก"
                >
                  <DeleteIcon
                    className="h-3 w-3 text-gray-8 hover:cursor-pointer hover:text-red-7"
                    aria-hidden
                  />
                </button>
              )}
            </span>
          </span>
        );
      })}
    </div>
  );
}
