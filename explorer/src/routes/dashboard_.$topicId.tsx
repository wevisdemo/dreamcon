import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ConversationTree } from '../components/conversation/conversation-tree';
import { CopyLink } from '../components/copy-link';
import { EventDetails } from '../components/event/event-details';
import { Modal } from '../components/modal';
import { getConversation, getEvents } from '../data/server-functions';
import { ChevronDownIcon } from '../icons/chevron-down';

export const Route = createFileRoute('/dashboard_/$topicId')({
  loader: async ({ params }) => {
    const [conversation, events] = await Promise.all([
      getConversation({ data: params.topicId }),
      getEvents(),
    ]);
    return { conversation, events };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.conversation.title} | Dream Constitution` }],
  }),
  component: function TopicDetail() {
    const { conversation, events } = Route.useLoaderData();
    const [selectedEventId, setSelectedEventId] = useState<string>();

    const selectedEvent = events.find(({ id }) => id === selectedEventId);

    return (
      <div className="flex flex-1 justify-center bg-blue-5 px-5 pt-2.5 pb-5 md:pt-5">
        <div className="flex w-full max-w-4xl flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-b6 text-white hover:text-blue-3"
            >
              <ChevronDownIcon className="size-6 rotate-90" />
              <span className="[text-box:trim-both_cap_alphabetic]">
                กลับหน้าข้อถกเถียง
              </span>
            </Link>
            <CopyLink path={`/dashboard/${conversation.id}`} />
          </div>
          <ConversationTree
            conversation={conversation}
            events={events}
            onEventSelect={setSelectedEventId}
          />
        </div>
        <Modal
          isOpen={selectedEvent !== undefined}
          onClose={() => setSelectedEventId(undefined)}
        >
          {selectedEvent && <EventDetails event={selectedEvent} />}
        </Modal>
      </div>
    );
  },
});
