import type { Conversation, TopicGroup } from '../data/conversations';
import type { CategoryQuestions } from '../data/group-questions';

/** A selected category, optionally narrowed down to one of its groups by id */
export type CategorySelection = { category: string; groupId?: string };

/**
 * Checks whether an untrusted value, like a search param, is a category
 * selection.
 *
 * @param value - Value to check
 * @returns `true` when `value` has a string `category` and, if any, a string
 * `groupId`
 */
export const isCategorySelection = (
  value: unknown
): value is CategorySelection =>
  typeof value === 'object' &&
  value !== null &&
  'category' in value &&
  typeof value.category === 'string' &&
  (!('groupId' in value) ||
    value.groupId === undefined ||
    typeof value.groupId === 'string');

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
  { category, groupId }: CategorySelection
) =>
  groups.some(topicGroup =>
    groupId === undefined
      ? topicGroup.category === category
      : topicGroup.id === groupId
  );

const OTHER_CATEGORY = 'อื่น ๆ';

/** A category with its topic count and each of its groups' topic counts */
export type CategorySummary = {
  category: string;
  count: number;
  groups: { id: string; phrase: string; count: number }[];
};

/**
 * Counts the topics in each category and in each of its groups.
 *
 * @param categories - Categories with their groups
 * @param conversations - Topics to count
 * @returns Every category, most topics first with "อื่น ๆ" last, each with its
 * groups, most topics first
 */
export const summarizeCategories = (
  categories: CategoryQuestions[],
  conversations: Pick<Conversation, 'groups'>[]
): CategorySummary[] => {
  const countTopics = (selection: CategorySelection) =>
    conversations.filter(({ groups }) =>
      matchesCategorySelection(groups, selection)
    ).length;

  return categories
    .map(({ category, groups }) => ({
      category,
      count: countTopics({ category }),
      groups: groups
        .map(({ id, phrase }) => ({
          id,
          phrase,
          count: countTopics({ category, groupId: id }),
        }))
        .toSorted((a, b) => b.count - a.count),
    }))
    .toSorted(
      (a, b) =>
        Number(a.category === OTHER_CATEGORY) -
          Number(b.category === OTHER_CATEGORY) || b.count - a.count
    );
};

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
  { groupId }: CategorySelection
) => groups.find(({ id }) => id === groupId)?.distanceToPhrase ?? Infinity;

/**
 * Describes the category selection for display.
 *
 * @param categories - Categories with their groups
 * @param selection - Selected category, and group when one is selected
 * @returns `category > phrase` when a group is selected, otherwise `category`
 */
export const formatCategorySelection = (
  categories: CategoryQuestions[],
  { category, groupId }: CategorySelection
) => {
  const phrase = categories
    .find(item => item.category === category)
    ?.groups.find(({ id }) => id === groupId)?.phrase;
  return phrase ? `${category} > ${phrase}` : category;
};
