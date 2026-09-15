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
      className="flex items-center gap-1 hover:cursor-pointer"
      onClick={handleCopy}
    >
      <ChainIcon className={copied ? 'text-blue-5' : 'text-gray-5'} />
      <span className={copied ? 'text-blue-5' : 'text-gray-5'}>
        {copied ? 'คัดลอกแล้ว!' : 'แชร์ลิงก์'}
      </span>
    </div>
  );
}
