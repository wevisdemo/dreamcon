export function EventSet({
  label,
  eventIds,
  eventNames,
  className = '',
}: {
  label?: string;
  eventIds: string[];
  eventNames: Map<string, string>;
  className?: string;
}) {
  const names = eventIds.flatMap(id => eventNames.get(id) ?? []);

  return (
    names.length > 0 && (
      <p
        className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-b7 text-blue-8 ${className}`}
      >
        {label}จาก {names.length} วงสนทนา:
        {names.map(name => (
          <b
            key={name}
            className="not-last:border-r not-last:border-blue-8 not-last:pr-2"
          >
            {name}
          </b>
        ))}
      </p>
    )
  );
}
