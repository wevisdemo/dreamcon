import { SearchIcon } from '../icons/search';

export function SearchBar({
  onSearch,
  defaultValue,
  placeholder = 'ค้นหาคำ...',
  className = '',
}: {
  onSearch: (query: string) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <form
      role="search"
      onSubmit={event => {
        event.preventDefault();
        onSearch(new FormData(event.currentTarget).get('query') as string);
      }}
      className={`flex h-9.5 items-center rounded-full border-2 border-white bg-white not-has-placeholder-shown:border-blue-7 hover:border-blue-7 has-focus:border-blue-7 ${className}`}
    >
      <input
        type="search"
        name="query"
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={placeholder}
        className="peer min-w-0 flex-1 bg-transparent px-5 text-b5 font-bold text-blue-7 outline-none placeholder:font-normal placeholder:text-blue-6 [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        type="submit"
        aria-label="ค้นหา"
        className="-m-0.5 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-5 peer-not-placeholder-shown:bg-blue-7 peer-not-placeholder-shown:text-white"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
}
