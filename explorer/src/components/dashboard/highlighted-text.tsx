import { useEffect, useRef } from 'react';

export function HighlightedText({
  text,
  keyword,
}: {
  text: string;
  keyword: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current?.firstChild;
    if (!keyword || !node || !('highlights' in CSS)) return;

    const highlight = CSS.highlights.get('search') ?? new Highlight();
    CSS.highlights.set('search', highlight);

    const pattern = new RegExp(
      keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'gi'
    );
    const ranges = [...text.matchAll(pattern)].map(match => {
      const range = new Range();
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      return range;
    });
    ranges.forEach(range => highlight.add(range));
    return () => ranges.forEach(range => highlight.delete(range));
  }, [text, keyword]);

  return (
    <span
      ref={ref}
      className="[&::highlight(search)]:bg-blue-7 [&::highlight(search)]:text-white"
    >
      {text}
    </span>
  );
}
