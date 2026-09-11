import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  doc,
  DocumentSnapshot,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import FullPageLoader from '../components/FullPageLoader';
import ModalComment from '../components/share/ModalComment';
import CommentDndContext from '../components/topic/CommentDndContext';
import ShareTopicLink from '../components/topic/ShareTopicLink';
import TopicTemplate from '../components/topic/TopicTemplate';
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
  const {
    topicPage: topicPageContext,
    event: eventContext,
    selectedTopic,
  } = useContext(StoreContext);
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
        <div className="relative bg-blue-4 w-screen h-full flex flex-col items-center">
          {selectedTopic.value && (
            <>
              <div className="w-full h-8 bg-gray-2 flex justify-center items-center">
                <div className="w-full max-w-230 flex">
                  <a
                    className="text-blue-6 text-label wv-ibmplex underline!"
                    href={topicsUrl()}
                  >
                    กลับหน้าหลัก
                  </a>
                </div>
                <ShareTopicLink topicId={selectedTopic.value.id} />
              </div>
              <section className="py-6 overflow-scroll w-full flex justify-center">
                <TopicTemplate
                  topic={selectedTopic.value}
                  onDeleted={() => {
                    window.location.href = topicsUrl();
                  }}
                />
              </section>
              <section className="absolute w-full h-content z-30 bg-transparent">
                <ModalComment
                  store={topicPageContext.modalComment}
                  events={eventContext.events}
                />
              </section>
            </>
          )}
        </div>
      </CommentDndContext>
    </DefaultLayout>
  );
}
