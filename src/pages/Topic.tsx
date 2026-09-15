import { useContext, useEffect } from 'react';
import {
  collection,
  doc,
  DocumentSnapshot,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import CommentDndContext from '../components/topic/CommentDndContext';
import ModalComment from '../components/topic/ModalComment';
import ShareTopicLink from '../components/topic/ShareTopicLink';
import TopicTemplate from '../components/topic/TopicTemplate';
import FullPageLoader from '../components/ui/FullPageLoader';
import { usePageSession } from '../hooks/usePageSession';
import DefaultLayout from '../layouts/default';
import { StoreContext } from '../store';
import { CommentDB } from '../types/comment';
import { TopicDB } from '../types/topic';
import { db } from '../utils/firestore';
import { convertTopicDBToTopic } from '../utils/mapping';

const topicsUrl = () =>
  `${window.location.origin}/topics/?${new URLSearchParams(
    window.location.search
  ).toString()}`;

export default function TopicPage() {
  const { id: topicId } = useParams();
  const { topicPage: topicPageContext, selectedTopic } =
    useContext(StoreContext);
  const { eventsReady } = usePageSession('topic');

  const showTopic = async (
    topicSnapshot: DocumentSnapshot,
    isLatest: () => boolean
  ) => {
    if (!topicSnapshot.exists()) {
      console.error('Topic not found');
      window.location.href = topicsUrl();
      return;
    }
    const commentsSnapshot = await getDocs(
      query(
        collection(db, 'comments'),
        where('parent_topic_id', '==', topicSnapshot.id)
      )
    );
    if (!isLatest()) return;
    const comments = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as CommentDB[];
    const topic = { id: topicSnapshot.id, ...topicSnapshot.data() } as TopicDB;

    selectedTopic.setValue(convertTopicDBToTopic(topic, comments));
  };

  useEffect(() => {
    if (!topicId) {
      window.location.href = topicsUrl();
      return;
    }
    let latestSnapshot: DocumentSnapshot | null = null;
    return onSnapshot(doc(db, 'topics', topicId), snapshot => {
      latestSnapshot = snapshot;
      showTopic(snapshot, () => latestSnapshot === snapshot);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resubscribe only when the route param changes
  }, [topicId]);

  return (
    <DefaultLayout>
      <CommentDndContext>
        {(!selectedTopic.value || !eventsReady) && <FullPageLoader />}
        <div className="relative flex h-full w-screen flex-col items-center bg-blue-4">
          {selectedTopic.value && (
            <>
              <div className="flex h-8 w-full items-center justify-center bg-gray-2">
                <div className="flex w-full max-w-230">
                  <a
                    className="wv-ibmplex text-label text-blue-6 underline!"
                    href={topicsUrl()}
                  >
                    กลับหน้าหลัก
                  </a>
                </div>
                <ShareTopicLink topicId={selectedTopic.value.id} />
              </div>
              <section className="flex w-full justify-center overflow-scroll py-6">
                <TopicTemplate
                  topic={selectedTopic.value}
                  onDeleted={() => {
                    window.location.href = topicsUrl();
                  }}
                />
              </section>
              <section className="pointer-events-none absolute inset-0 z-30">
                <ModalComment
                  store={topicPageContext.modalComment}
                  topics={[selectedTopic.value]}
                />
              </section>
            </>
          )}
        </div>
      </CommentDndContext>
    </DefaultLayout>
  );
}
