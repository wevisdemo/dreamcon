import { useState } from 'react';
import ChainIcon from '../icon/ChainIcon';

export default function ShareTopicLink({ topicId }: { topicId: string }) {
  const [copiedTopicId, setCopiedTopicId] = useState<string | null>(null);
  const copied = copiedTopicId === topicId;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/topics/${topicId}`
    );
    setCopiedTopicId(topicId);
  };

  return (
    <div
      className="flex gap-[4px] items-center hover:cursor-pointer"
      onClick={handleCopy}
    >
      <ChainIcon color={copied ? '#4999FA' : '#979797'} />
      <span className={copied ? 'text-[#4999FA]' : 'text-gray5'}>
        {copied ? 'คัดลอกแล้ว!' : 'แชร์ลิงก์'}
      </span>
    </div>
  );
}
