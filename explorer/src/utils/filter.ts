import search from 'approx-string-match';
import type { Comment, Conversation, TopicGroup } from '../data/conversations';
import type { Event } from '../data/events';
import type { CategoryQuestions } from '../data/group-questions';

/** A selected category, optionally narrowed down to one of its groups */
export type CategorySelection = { category: string; group?: number };

/** Selected participant types, or a single event */
export type EventSelection =
  | { targetGroupTypes: string[] }
  | { eventId: string };

/**
 * Checks whether an untrusted value, like a search param, is a category
 * selection.
 *
 * @param value - Value to check
 * @returns `true` when `value` has a string `category` and, if any, a number
 * `group`
 */
export const isCategorySelection = (
  value: unknown
): value is CategorySelection =>
  typeof value === 'object' &&
  value !== null &&
  'category' in value &&
  typeof value.category === 'string' &&
  (!('group' in value) ||
    value.group === undefined ||
    typeof value.group === 'number');

/**
 * Checks whether an untrusted value, like a search param, is an event
 * selection.
 *
 * @param value - Value to check
 * @returns `true` when `value` has a string `eventId` or a list of string
 * `targetGroupTypes`
 */
export const isEventSelection = (value: unknown): value is EventSelection =>
  typeof value === 'object' &&
  value !== null &&
  (('eventId' in value && typeof value.eventId === 'string') ||
    ('targetGroupTypes' in value &&
      Array.isArray(value.targetGroupTypes) &&
      value.targetGroupTypes.every(type => typeof type === 'string')));

/** Where a keyword was found in a text, and how many typos it took */
export type KeywordMatch = { start: number; end: number; errors: number };

const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: 'grapheme',
});

const flattenComments = (comments: Comment[]): Comment[] =>
  comments.flatMap(comment => [comment, ...flattenComments(comment.comments)]);

/**
 * Finds a keyword in a text case-insensitively, tolerating one typo
 * (insertion, deletion or substitution) per 5 characters of the keyword.
 *
 * @param text - Text to search in
 * @param keyword - Keyword to find
 * @returns Non-overlapping matches sharing the fewest typos, so exact matches
 * hide fuzzy ones. Offsets are widened to whole grapheme clusters so Thai
 * vowels and tone marks stay with their consonant. Empty when nothing is close
 * enough
 */
export const findKeywordMatches = (
  text: string,
  keyword: string
): KeywordMatch[] => {
  if (!keyword) return [];

  const matches = search(
    text.toLowerCase(),
    keyword.toLowerCase(),
    Math.floor(keyword.length / 5)
  );
  if (matches.length === 0) return [];

  const boundaries = [
    ...Array.from(graphemeSegmenter.segment(text), ({ index }) => index),
    text.length,
  ];

  return matches
    .map(({ start, end, errors }) => ({
      start: boundaries.findLast(boundary => boundary <= start) ?? 0,
      end: boundaries.find(boundary => boundary >= end) ?? text.length,
      errors,
    }))
    .toSorted((a, b) => a.start - b.start)
    .reduce<KeywordMatch[]>((kept, match) => {
      const last = kept.at(-1);
      return last && match.start < last.end ? kept : [...kept, match];
    }, []);
};

const countTypos = (text: string, keyword: string) =>
  Math.min(...findKeywordMatches(text, keyword).map(({ errors }) => errors));

/**
 * Keeps the topics matching a keyword, tolerating typos as
 * {@link findKeywordMatches} does.
 *
 * @param conversations - Topics to search, in the order to keep
 * @param keyword - Text to look for; an empty keyword matches every topic
 * @returns Topics whose title, category or any comment at any depth matches
 * `keyword`, each with `matchedComment` set to the first comment with the
 * fewest typos, and `searchScore` ranking how close the match is: fewer typos
 * first, then a title or category match before a comment-only one. Lower is
 * closer
 */
export const searchConversations = <
  T extends Pick<Conversation, 'title' | 'groups' | 'comments'>,
>(
  conversations: T[],
  keyword: string
): (T & { matchedComment?: Comment; searchScore?: number })[] => {
  if (!keyword) return conversations;

  return conversations.flatMap(conversation => {
    const topicTypos = Math.min(
      countTypos(conversation.title, keyword),
      ...conversation.groups.map(({ category }) =>
        countTypos(category, keyword)
      )
    );
    const { comment: matchedComment, typos: commentTypos } = flattenComments(
      conversation.comments
    )
      .map(comment => ({ comment, typos: countTypos(comment.reason, keyword) }))
      .reduce<{ comment?: Comment; typos: number }>(
        (best, candidate) => (candidate.typos < best.typos ? candidate : best),
        { typos: Infinity }
      );
    const typos = Math.min(topicTypos, commentTypos);

    return typos === Infinity
      ? []
      : [
          {
            ...conversation,
            matchedComment,
            searchScore: typos * 2 + (topicTypos === typos ? 0 : 1),
          },
        ];
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
 * Measures how close a topic is to the phrase of the selected group.
 *
 * @param groups - Groups the topic belongs to
 * @param selection - Selected category and group
 * @returns Embedding distance between the topic and the group's phrase, where
 * lower is closer, or `Infinity` when the topic is not in the group
 */
export const getDistanceToPhrase = (
  groups: TopicGroup[],
  { category, group }: CategorySelection
) =>
  groups.find(
    topicGroup => topicGroup.category === category && topicGroup.group === group
  )?.distanceToPhrase ?? Infinity;

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
    : selection.targetGroupTypes.join(' | ');
