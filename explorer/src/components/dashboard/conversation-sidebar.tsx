import { useState } from 'react';
import type { Conversation } from '../../data/conversations';
import type { Event } from '../../data/events';
import { ArrowUpIcon } from '../../icons/arrow-up';
import { ChevronsLeftIcon } from '../../icons/chevrons-left';
import { Button } from '../button';
import { ConversationTree } from '../conversation/conversation-tree';
import { EventDetails } from '../event/event-details';
import { Modal } from '../modal';
import { Sidebar } from './sidebar';

export function ConversationSidebar({
  isOpen,
  conversation,
  events,
  conversations,
  onClose,
  onEventFilter,
}: {
  isOpen: boolean;
  conversation?: Conversation;
  events: Event[];
  conversations: Pick<Conversation, 'eventIds'>[];
  onClose: () => void;
  onEventFilter: (eventId: string) => void;
}) {
  const [selected, setSelected] = useState<{
    conversationId: string;
    eventId: string;
  }>();

  const selectedEvent =
    isOpen && selected?.conversationId === conversation?.id
      ? events.find(({ id }) => id === selected?.eventId)
      : undefined;

  const selectedEventTopicCount = conversations.filter(
    ({ eventIds }) => selectedEvent && eventIds.includes(selectedEvent.id)
  ).length;

  return (
    <Sidebar
      isOpen={isOpen}
      side="right"
      aria-label="รายละเอียดข้อถกเถียง"
      className="gap-2.5 bg-blue-5 px-5 pt-2.5 pb-5"
    >
      <Button
        variant="icon-white"
        icon={<ChevronsLeftIcon className="rotate-180" />}
        aria-label="ปิดรายละเอียด"
        onClick={onClose}
      />
      {conversation && (
        <ConversationTree
          key={conversation.id}
          conversation={conversation}
          events={events}
          onEventSelect={eventId =>
            setSelected({ conversationId: conversation.id, eventId })
          }
        />
      )}
      <Modal
        mount="parent"
        isOpen={selectedEvent !== undefined}
        onClose={() => setSelected(undefined)}
      >
        {selectedEvent && (
          <>
            <EventDetails
              event={selectedEvent}
              className="min-h-0 overflow-y-auto"
            />
            <Button
              variant="secondary"
              icon={<ArrowUpIcon className="rotate-90" />}
              onClick={() => {
                onEventFilter(selectedEvent.id);
                setSelected(undefined);
              }}
              className="mt-2.5 w-full"
            >
              ดู {selectedEventTopicCount} ข้อถกเถียงจากวงนี้
            </Button>
          </>
        )}
      </Modal>
    </Sidebar>
  );
}
