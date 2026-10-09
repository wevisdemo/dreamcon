import {
  asNumber,
  asString,
  Column,
  fetchCsv,
  Object,
  type StaticDecode,
} from 'sheethuahua';
import { csvUrl, once, toGroupId } from './shared';

export const groupQuestionSchema = Object({
  category: Column('category', asString()),
  group: Column('group', asNumber()),
  phrase: Column('phrase', asString()),
});

export type GroupQuestion = Omit<
  StaticDecode<typeof groupQuestionSchema>,
  'category'
> & { id: string };
export type CategoryQuestions = {
  category: string;
  groups: GroupQuestion[];
};

export const loadGroupQuestions = once(
  async (): Promise<CategoryQuestions[]> => {
    const questions = await fetchCsv(
      csvUrl('dreamcon-data', 'group_questions'),
      groupQuestionSchema
    );

    return [...Map.groupBy(questions, ({ category }) => category)].map(
      ([category, rows]) => ({
        category,
        groups: rows
          .toSorted((a, b) => a.group - b.group)
          .map(({ group, phrase }) => ({
            id: toGroupId(category, group),
            group,
            phrase,
          })),
      })
    );
  }
);
