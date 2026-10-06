export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="tablist" className="flex">
      {tabs.map(tab => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={tab.value === value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 cursor-pointer border-b-2 border-current px-5 py-2.5 text-b5 font-bold ${tab.value === value ? 'text-blue-7' : 'text-blue-4 hover:text-blue-5'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
