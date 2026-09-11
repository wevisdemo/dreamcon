import { TopicFilter } from '../types/home';
import { LightWeightTopic } from '../types/topic';

const byLatest = (a: LightWeightTopic, b: LightWeightTopic) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

export const selectTopicIds = (
  lightWeightTopics: LightWeightTopic[],
  filter: TopicFilter,
  limit: number,
  pinnedIds: string[]
): string[] => {
  const search = filter.searchText.toLowerCase();
  const isPinned = (topic: LightWeightTopic) => pinnedIds.includes(topic.id);

  return lightWeightTopics
    .filter(
      topic =>
        topic.title.toLowerCase().includes(search) &&
        (filter.selectedEvent === null ||
          topic.event_ids.includes(filter.selectedEvent.id)) &&
        (filter.category === 'ทั้งหมด' || topic.category === filter.category)
    )
    .sort(
      (a, b) =>
        Number(isPinned(b)) - Number(isPinned(a)) ||
        (filter.sortedBy === 'most-commented'
          ? b.comment_level1_count - a.comment_level1_count || byLatest(a, b)
          : byLatest(a, b))
    )
    .slice(0, limit)
    .map(topic => topic.id);
};
