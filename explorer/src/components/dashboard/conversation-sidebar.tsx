import type { Conversation } from '../../data/conversations';
import type { Event } from '../../data/events';
import { ChevronsLeftIcon } from '../../icons/chevrons-left';
import { Button } from '../button';
import { ConversationTree } from '../conversation/conversation-tree';
import { Sidebar } from './sidebar';

export function ConversationSidebar({
  isOpen,
  conversation,
  events,
  onClose,
}: {
  isOpen: boolean;
  conversation?: Conversation;
  events: Event[];
  onClose: () => void;
}) {
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
        />
      )}
    </Sidebar>
  );
}
