import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import type { Conversation } from '../../data/conversations';
import type { Event } from '../../data/events';
import { ArrowUpIcon } from '../../icons/arrow-up';
import { ChevronsLeftIcon } from '../../icons/chevrons-left';
import { ExpandIcon } from '../../icons/expand';
import { Button } from '../button';
import { ConversationTree } from '../conversation/conversation-tree';
import { CopyLink } from '../copy-link';
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
  const [selectedEventId, setSelectedEventId] = useState<string>();
  const openConversationId = isOpen ? conversation?.id : undefined;
  const [prevOpenConversationId, setPrevOpenConversationId] =
    useState(openConversationId);

  if (openConversationId !== prevOpenConversationId) {
    setPrevOpenConversationId(openConversationId);
    setSelectedEventId(undefined);
  }

  const selectedEvent = events.find(({ id }) => id === selectedEventId);

  const selectedEventTopicCount = conversations.filter(
    ({ eventIds }) => selectedEvent && eventIds.includes(selectedEvent.id)
  ).length;

  return (
    <Sidebar
      isOpen={isOpen}
      side="right"
      aria-label="รายละเอียดข้อถกเถียง"
      className="gap-2.5 bg-blue-5 px-5 pt-2.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="icon-white"
            icon={<ChevronsLeftIcon className="rotate-180" />}
            aria-label="ปิดรายละเอียด"
            onClick={onClose}
          />
          {conversation && (
            <Link
              to="/dashboard/$topicId"
              params={{ topicId: conversation.id }}
              state={{ isFromDashboard: true }}
              viewTransition
              aria-label="เปิดแบบเต็มหน้าจอ"
              className="flex size-7 items-center justify-center text-white hover:text-blue-3"
            >
              <ExpandIcon className="size-6" />
            </Link>
          )}
        </div>
        {conversation && (
          <CopyLink
            key={conversation.id}
            path={`/dashboard/${conversation.id}`}
          />
        )}
      </div>
      {conversation && (
        <ConversationTree
          key={conversation.id}
          conversation={conversation}
          events={events}
          onEventSelect={setSelectedEventId}
          className="pb-5"
        />
      )}
      <Modal
        mount="parent"
        isOpen={selectedEvent !== undefined}
        onClose={() => setSelectedEventId(undefined)}
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
                onClose();
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
