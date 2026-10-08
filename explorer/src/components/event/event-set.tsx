export function EventSet({
  label,
  eventIds,
  eventNames,
  onSelect,
  className = '',
}: {
  label?: string;
  eventIds: string[];
  eventNames: Map<string, string>;
  onSelect?: (eventId: string) => void;
  className?: string;
}) {
  const events = eventIds.flatMap(id => {
    const name = eventNames.get(id);
    return name ? [{ id, name }] : [];
  });

  return (
    events.length > 0 && (
      <p
        className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-b7 text-blue-8 ${className}`}
      >
        {label}จาก {events.length} วงสนทนา:
        {events.map(({ id, name }) => (
          <b
            key={id}
            className="not-last:border-r not-last:border-blue-8 not-last:pr-2"
          >
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(id)}
                className="cursor-pointer underline hover:text-blue-10"
              >
                {name}
              </button>
            ) : (
              name
            )}
          </b>
        ))}
      </p>
    )
  );
}
