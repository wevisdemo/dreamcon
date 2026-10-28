import search from 'approx-string-match';
import type { Comment, Conversation } from '../data/conversations';
import type { SearchGroup } from '../data/search-groups';

/** Where a keyword was found in a text, and how many typos it took */
export type KeywordMatch = { start: number; end: number; errors: number };

const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: 'grapheme',
});

const flattenComments = (comments: Comment[]): Comment[] =>
  comments.flatMap(comment => [comment, ...flattenComments(comment.comments)]);

/**
 * Expands a keyword with the other keywords sharing a search group with it, so
 * searching one alias also finds the rest.
 *
 * @param keyword - Keyword typed by the user
 * @param searchGroups - Groups of keywords meaning the same thing
 * @returns `keyword` followed by the other keywords of every group containing
 * it (compared case-insensitively), without duplicates. Empty for an empty
 * keyword
 */
export const expandKeyword = (
  keyword: string,
  searchGroups: SearchGroup[]
): string[] => {
  if (!keyword) return [];

  const normalized = keyword.trim().toLowerCase();
  const aliases = searchGroups
    .filter(group => group.some(alias => alias.toLowerCase() === normalized))
    .flat();
  return [...new Set([keyword, ...aliases])];
};

/**
 * Finds keywords in a text case-insensitively, tolerating one typo
 * (insertion, deletion or substitution) per 5 characters of each keyword.
 *
 * @param text - Text to search in
 * @param keywords - Keywords to find, any of which may match
 * @returns Non-overlapping matches sharing the fewest typos across all
 * keywords, so exact matches hide fuzzy ones. Offsets are widened to whole
 * grapheme clusters so Thai vowels and tone marks stay with their consonant.
 * Empty when nothing is close enough
 */
export const findKeywordMatches = (
  text: string,
  keywords: string[]
): KeywordMatch[] => {
  const lowerText = text.toLowerCase();
  const matches = keywords.flatMap(keyword =>
    keyword
      ? search(lowerText, keyword.toLowerCase(), Math.floor(keyword.length / 5))
      : []
  );
  if (matches.length === 0) return [];

  const fewestErrors = Math.min(...matches.map(({ errors }) => errors));
  const boundaries = [
    ...Array.from(graphemeSegmenter.segment(text), ({ index }) => index),
    text.length,
  ];

  return matches
    .filter(({ errors }) => errors === fewestErrors)
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

const countTypos = (text: string, keywords: string[]) =>
  Math.min(...findKeywordMatches(text, keywords).map(({ errors }) => errors));

/**
 * Keeps the topics matching any of the keywords, tolerating typos as
 * {@link findKeywordMatches} does.
 *
 * @param conversations - Topics to search, in the order to keep
 * @param keywords - Texts to look for; no keywords matches every topic
 * @returns Topics whose title, category or any comment at any depth matches
 * any of `keywords`, each with `matchedComment` set to the first comment with the
 * fewest typos, and `searchScore` ranking how close the match is: fewer typos
 * first, then a title or category match before a comment-only one. Lower is
 * closer
 */
export const searchConversations = <
  T extends Pick<Conversation, 'title' | 'groups' | 'comments'>,
>(
  conversations: T[],
  keywords: string[]
): (T & { matchedComment?: Comment; searchScore?: number })[] => {
  if (keywords.length === 0) return conversations;

  return conversations.flatMap(conversation => {
    const topicTypos = Math.min(
      countTypos(conversation.title, keywords),
      ...conversation.groups.map(({ category }) =>
        countTypos(category, keywords)
      )
    );
    const { comment: matchedComment, typos: commentTypos } = flattenComments(
      conversation.comments
    )
      .map(comment => ({
        comment,
        typos: countTypos(comment.reason, keywords),
      }))
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
