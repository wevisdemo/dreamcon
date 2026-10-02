import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import {
  asNumber,
  asString,
  Column,
  fetchCsv,
  Object,
  type StaticDecode,
} from 'sheethuahua';
import { csvUrl, once } from './shared';

const groupQuestionSchema = Object({
  category: Column('category', asString()),
  group: Column('group', asNumber()),
  question: Column('question', asString()),
  phrase: Column('phrase', asString()),
});

export type GroupQuestion = Pick<
  StaticDecode<typeof groupQuestionSchema>,
  'question' | 'phrase'
>;
export type CategoryQuestions = {
  category: string;
  groups: GroupQuestion[];
};

export const getGroupQuestions = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .handler(
    once(async (): Promise<CategoryQuestions[]> => {
      const questions = await fetchCsv(
        csvUrl('dreamcon-data', 'group_questions'),
        groupQuestionSchema
      );

      return [...Map.groupBy(questions, ({ category }) => category)].map(
        ([category, rows]) => {
          const groups = rows.toSorted((a, b) => a.group - b.group);
          if (groups.some(({ group }, index) => group !== index)) {
            throw new Error(`Groups of "${category}" must be numbered 0..n`);
          }
          return {
            category,
            groups: groups.map(({ question, phrase }) => ({
              question,
              phrase,
            })),
          };
        }
      );
    })
  );
