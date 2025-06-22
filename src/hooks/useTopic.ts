import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  limit,
  orderBy,
  documentId,
} from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../utils/firestore';
import { LightWeightTopic, Topic, TopicDB } from '../types/topic';
import { CommentDB } from '../types/comment';
import { convertTopicDBToTopic } from '../utils/mapping';

// filepath: /Users/petchsongpon/projects/wevis/dreamcon/src/hooks/useTopic.ts

export const useTopic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTopicByEventId = async (eventId: string): Promise<Topic[]> => {
    setLoading(true);
    setError(null);

    try {
      const topicsCollection = collection(db, 'topics');
      const q = query(topicsCollection, where('event_id', '==', eventId));
      const snapshot = await getDocs(q);
      const topics = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          comments: data.comments || [],
          created_at: data.created_at.toDate(),
          updated_at: data.updated_at.toDate(),
          notified_at: data.notified_at.toDate(),
        } as Topic;
      });

      return topics;
    } catch (err) {
      console.error('Error fetching topics: ', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getCommentLevel1Count = async (topicId: string): Promise<number> => {
    const commentsCollection = collection(db, 'comments');
    const commentQuery = query(
      commentsCollection,
      where('parent_topic_id', '==', topicId),
      where('parent_comment_ids', '==', [])
    );
    const snapshot = await getCountFromServer(commentQuery);
    const count = snapshot.data().count;
    return count;
  };

  const getLightWeightTopics = async (): Promise<LightWeightTopic[]> => {
    try {
      const topicsCollection = collection(db, 'topics');
      const snapshot = await getDocs(topicsCollection);
      const topics = Promise.all(
        snapshot.docs.map(async doc => {
          const data = doc.data();
          const commentLv1Count = await getCommentLevel1Count(doc.id);
          return {
            id: doc.id,
            title: data.title,
            category: data.category,
            created_at: data.created_at.toDate(),
            event_id: data.event_id,
            comment_level1_count: commentLv1Count,
          } as LightWeightTopic;
        })
      );
      return topics;
    } catch (err) {
      console.error('Error fetching light weight topics: ', err);
      return [];
    }
  };

  const getTopicByIds = async (topicIds: string[]): Promise<Topic[]> => {
    setLoading(true);
    setError(null);
    const topicIdsList = topicIds;
    if (topicIdsList.length === 0) {
      setLoading(false);
      return [];
    }
    const chunkSize = 30;
    const chunks = [];
    for (let i = 0; i < topicIdsList.length; i += chunkSize) {
      chunks.push(topicIdsList.slice(i, i + chunkSize));
    }
    try {
      const results = await Promise.all(
        chunks.map(chunk => getSeparatedTopicsByIds(chunk))
      );
      return results.flat();
    } catch (err) {
      console.error('Error fetching topics by ids: ', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSeparatedTopicsByIds = async (
    topicIdsList: string[]
  ): Promise<Topic[]> => {
    const topicsCollection = collection(db, 'topics');

    const q = query(topicsCollection, where(documentId(), 'in', topicIdsList));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return [];
    }
    const topics = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...doc.data(),
        id: doc.id,
        created_at: data.created_at.toDate(),
        updated_at: data.updated_at.toDate(),
        notified_at: data.notified_at.toDate(),
      } as TopicDB;
    });
    const topicIds = topics.map(topic => topic.id);
    const commentsCollection = collection(db, 'comments');
    const commentsQuery = query(
      commentsCollection,
      where('parent_topic_id', 'in', topicIds)
    );

    const commentsSnapshot = await getDocs(commentsQuery);
    const commentsByTopic: Record<string, CommentDB[]> = {};

    commentsSnapshot.forEach(doc => {
      const commentDB = { id: doc.id, ...doc.data() } as CommentDB;
      const topicId = commentDB.parent_topic_id;

      if (!commentsByTopic[topicId]) {
        commentsByTopic[topicId] = [];
      }
      commentsByTopic[topicId].push(commentDB);
    });
    // Map comments to topics
    const fineTopics = topics
      .map(topic => {
        const comments = commentsByTopic[topic.id] || [];
        return convertTopicDBToTopic(topic, comments);
      })
      .sort((a, b) => {
        return a.created_at > b.created_at ? -1 : 1;
      });
    return fineTopics;
  };

  const getTopicsByFilter = async (filter: {
    limit: number;
    orderBy: {
      field: string;
      direction: 'asc' | 'desc';
    };
  }): Promise<Topic[]> => {
    setLoading(true);
    setError(null);

    try {
      const topicsCollection = collection(db, 'topics');
      const q = query(
        topicsCollection,
        orderBy(filter.orderBy.field, filter.orderBy.direction),
        limit(filter.limit)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return [];
      }
      const topics = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          comments: data.comments || [],
          created_at: data.created_at.toDate(),
          updated_at: data.updated_at.toDate(),
          notified_at: data.notified_at.toDate(),
        } as Topic;
      });

      const topicIds = topics.map(topic => topic.id);

      const commentsCollection = collection(db, 'comments');

      const commentsQuery = query(
        commentsCollection,
        where('parent_topic_id', 'in', topicIds)
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsByTopic: Record<string, CommentDB[]> = {};
      commentsSnapshot.forEach(doc => {
        const commentDB = { id: doc.id, ...doc.data() } as CommentDB;
        const topicId = commentDB.parent_topic_id;

        if (!commentsByTopic[topicId]) {
          commentsByTopic[topicId] = [];
        }
        commentsByTopic[topicId].push(commentDB);
      });

      // Map comments to topics
      const fineTopics = topics
        .map(topic => {
          const comments = commentsByTopic[topic.id] || [];
          return convertTopicDBToTopic(topic, comments);
        })
        .sort((a, b) => {
          return a.created_at > b.created_at ? -1 : 1;
        });

      return fineTopics;
    } catch (err) {
      console.error('Error fetching topics by filter: ', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    getTopicsByFilter,
    getTopicByEventId,
    getLightWeightTopics,
    getTopicByIds,
    loading,
    error,
  };
};
