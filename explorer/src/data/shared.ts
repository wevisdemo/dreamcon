import { asArray, asString } from 'sheethuahua';

export const csvUrl = (repo: 'dreamcon' | 'dreamcon-data', name: string) =>
  `https://raw.githubusercontent.com/wevisdemo/${repo}/published-data/${name}.csv`;

export const once = <T>(load: () => Promise<T>) => {
  let cached: Promise<T> | undefined;
  return () =>
    (cached ??= load().catch(error => {
      cached = undefined;
      throw error;
    }));
};

export const asStrings = () => asArray(asString());

export const toGroupId = (category: string, group: number) =>
  `${category}:${group}`;
