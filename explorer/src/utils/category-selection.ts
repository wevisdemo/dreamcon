import type { TopicGroup } from '../data/conversations';
import type { CategoryQuestions } from '../data/group-questions';

/** A selected category, optionally narrowed down to one of its groups */
export type CategorySelection = { category: string; group?: number };

/**
 * Checks whether a topic falls in the selection.
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
 * Describes the selection for display.
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
