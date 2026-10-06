const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

const toGraphemes = (text: string) =>
  Array.from(segmenter.segment(text), ({ segment }) => segment);

/**
 * Cuts `text` around the first case-insensitive match of `keyword`, keeping the
 * match centered. Length is counted in grapheme clusters, so Thai vowels and
 * tone marks stay with their consonant. Room one side can't use goes to the
 * other side, and `...` marks each side that was cut.
 *
 * @param text - Text to search in
 * @param keyword - Keyword to find
 * @param maxLength - Maximum characters of the excerpt, excluding the `...`
 * marks. A match longer than this is returned whole
 * @returns The excerpt, or `undefined` when `text` doesn't contain `keyword`
 */
export function excerptAroundKeyword(
  text: string,
  keyword: string,
  maxLength = 30
) {
  const start = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (start < 0) return undefined;

  const end = start + keyword.length;
  const before = toGraphemes(text.slice(0, start));
  const after = toGraphemes(text.slice(end));
  const room = Math.max(
    0,
    maxLength - toGraphemes(text.slice(start, end)).length
  );
  const afterCount = Math.min(
    after.length,
    room - Math.min(before.length, Math.floor(room / 2))
  );
  const beforeCount = Math.min(before.length, room - afterCount);

  return [
    beforeCount < before.length ? '...' : '',
    ...before.slice(before.length - beforeCount),
    text.slice(start, end),
    ...after.slice(0, afterCount),
    afterCount < after.length ? '...' : '',
  ].join('');
}
