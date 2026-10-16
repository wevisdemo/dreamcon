import search from 'approx-string-match';
import type { Comment, Conversation } from '../data/conversations';

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
