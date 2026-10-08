import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import {
  asNumber,
  asOneOf,
  asString,
  Column,
  fetchCsv,
  Object,
  type StaticDecode,
} from 'sheethuahua';
import { commentViews } from '../constants/comment-views';
import { asStrings, csvUrl, once } from './shared';

const topicSchema = Object({
  id: Column('id', asString()),
  title: Column('title', asString()),
  eventIds: Column('event_ids', asStrings()),
});

const commentSchema = Object({
  id: Column('id', asString()),
  view: Column('comment_view', asOneOf(commentViews)),
  reason: Column('reason', asString()),
  eventIds: Column('event_ids', asStrings()),
  parentTopicId: Column('parent_topic_id', asString()),
  parentCommentId: Column('parent_comment_id', asString().optional()),
});

const topicGroupSchema = Object({
  id: Column('id', asString()),
  category: Column('category', asString()),
  group: Column('group', asNumber()),
});

export type TopicGroup = Omit<StaticDecode<typeof topicGroupSchema>, 'id'>;
export type Comment = StaticDecode<typeof commentSchema> & {
  comments: Comment[];
};
export type Conversation = StaticDecode<typeof topicSchema> & {
  groups: TopicGroup[];
  comments: Comment[];
};

const loadConversations = once(async (): Promise<Conversation[]> => {
  const [topics, topicGroups, comments] = await Promise.all([
    fetchCsv(csvUrl('dreamcon', 'topics'), topicSchema),
    fetchCsv(csvUrl('dreamcon-data', 'topic_groups'), topicGroupSchema),
    fetchCsv(csvUrl('dreamcon', 'comments'), commentSchema),
  ]);
  const groupsByTopic = Map.groupBy(topicGroups, ({ id }) => id);
  const commentsByParent = Map.groupBy(comments, comment =>
    comment.parentCommentId
      ? `comment:${comment.parentCommentId}`
      : `topic:${comment.parentTopicId}`
  );
  const nest = (parentKey: string): Comment[] =>
    (commentsByParent.get(parentKey) ?? []).map(comment => ({
      ...comment,
      comments: nest(`comment:${comment.id}`),
    }));

  return topics.map(topic => ({
    ...topic,
    groups: (groupsByTopic.get(topic.id) ?? []).map(({ category, group }) => ({
      category,
      group,
    })),
    comments: nest(`topic:${topic.id}`),
  }));
});

export const getConversations = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .handler(loadConversations);

export const getConversation = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const conversation = (await loadConversations()).find(
      conversation => conversation.id === id
    );
    if (!conversation) throw notFound();
    return conversation;
  });
