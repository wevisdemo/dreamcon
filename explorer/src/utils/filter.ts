import type { Comment, Conversation, TopicGroup } from '../data/conversations';
import type { Event } from '../data/events';
import type { CategoryQuestions } from '../data/group-questions';

/** A selected category, optionally narrowed down to one of its groups */
export type CategorySelection = { category: string; group?: number };

/** Selected participant types, or a single event */
export type EventSelection =
  | { targetGroupTypes: string[] }
  | { eventId: string };

const flattenComments = (comments: Comment[]): Comment[] =>
  comments.flatMap(comment => [comment, ...flattenComments(comment.comments)]);

/**
 * Keeps the topics matching a keyword, case-insensitively.
 *
 * @param conversations - Topics to search, in the order to keep
 * @param keyword - Text to look for; an empty keyword matches every topic
 * @returns Topics whose title, category or any comment at any depth contains
 * `keyword`, each with `matchedComment` set to the first matching comment
 */
export const searchConversations = <
  T extends Pick<Conversation, 'title' | 'groups' | 'comments'>,
>(
  conversations: T[],
  keyword: string
): (T & { matchedComment?: Comment })[] => {
  const includesKeyword = (text: string) =>
    text.toLowerCase().includes(keyword.toLowerCase());

  return conversations.flatMap(conversation => {
    const matchedComment = keyword
      ? flattenComments(conversation.comments).find(({ reason }) =>
          includesKeyword(reason)
        )
      : undefined;
    const isMatched =
      includesKeyword(conversation.title) ||
      conversation.groups.some(({ category }) => includesKeyword(category)) ||
      matchedComment;

    return isMatched ? [{ ...conversation, matchedComment }] : [];
  });
};

/**
 * Checks whether a topic falls in the category selection.
 *
 * @param groups - Groups the topic belongs to
 * @param selection - Selected category, and group when one is selected
 * @returns `true` when any of `groups` is in the selected category, and in the
 * selected group when one is selected
 */
export const matchesCategorySelection = (
  groups: TopicGroup[],
  { category, group }: CategorySelection
) =>
  groups.some(
    topicGroup =>
      topicGroup.category === category &&
      (group === undefined || topicGroup.group === group)
  );

/**
 * Describes the category selection for display.
 *
 * @param categories - Categories with their groups, where a group's index is
 * its number
 * @param selection - Selected category, and group when one is selected
 * @returns `category > phrase` when a group is selected, otherwise `category`
 */
export const formatCategorySelection = (
  categories: CategoryQuestions[],
  { category, group }: CategorySelection
) => {
  const phrase =
    group === undefined
      ? undefined
      : categories.find(item => item.category === category)?.groups[group]
          ?.phrase;
  return phrase ? `${category} > ${phrase}` : category;
};

/**
 * Checks whether a topic falls in the event selection.
 *
 * @param topic - Events the topic was discussed in and their participant types
 * @param selection - Selected participant types or event
 * @returns `true` when the topic was discussed in the selected event, or in an
 * event with any of the selected participant types
 */
export const matchesEventSelection = (
  {
    eventIds,
    targetGroupTypes,
  }: { eventIds: string[]; targetGroupTypes: string[] },
  selection: EventSelection
) =>
  'eventId' in selection
    ? eventIds.includes(selection.eventId)
    : selection.targetGroupTypes.some(type => targetGroupTypes.includes(type));

/**
 * Lists the participant types in the event selection.
 *
 * @param selection - Selected participant types or event, if any
 * @returns The selected participant types, or an empty list when an event or
 * nothing is selected
 */
export const getSelectedTargetGroupTypes = (selection?: EventSelection) =>
  selection && 'targetGroupTypes' in selection
    ? selection.targetGroupTypes
    : [];

/**
 * Describes the event selection for display.
 *
 * @param events - Events to look the selected event up in
 * @param selection - Selected participant types or event
 * @returns The event's display name when an event is selected, otherwise the
 * participant types separated by commas
 */
export const formatEventSelection = (
  events: Pick<Event, 'id' | 'displayName'>[],
  selection: EventSelection
) =>
  'eventId' in selection
    ? (events.find(({ id }) => id === selection.eventId)?.displayName ?? '')
    : selection.targetGroupTypes.join(', ');
