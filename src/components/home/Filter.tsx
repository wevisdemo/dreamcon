import { useState } from "react";
import { DreamConEvent } from "../../types/event";
import {
  TopicFilter,
  topicFilterCategories,
  TopicFilterCategory,
} from "../../types/home";
import DefaultFilterEvent from "./DefaultFilterEvent";
import FilterEvent from "./FilterEvent";

interface PropTypes {
  events: DreamConEvent[];
  filter: TopicFilter;
  setFilter: (filter: TopicFilter) => void;
}

export default function Filter(props: PropTypes) {
  const [textSearch, setTextSearch] = useState("");
  const handleEventChange = (event: DreamConEvent | null) => {
    props.setFilter({
      ...props.filter,
      selectedEvent: event,
    });
  };

  const handleSortChange = (sort: "latest" | "most-commented") => {
    props.setFilter({
      ...props.filter,
      sortedBy: sort,
    });
  };

  const handleCategoryChange = (category: TopicFilterCategory) => {
    props.setFilter({
      ...props.filter,
      category: category,
    });
  };

  const handleSearchTextChange = (text: string) => {
    props.setFilter({
      ...props.filter,
      searchText: text,
    });
  };

  return (
    <div className="bg-white w-full rounded-[16px] py-[16px] flex flex-col gap-[16px]">
      <div className="flex items-center gap-[18px] w-full pl-[24px] mt-[12px]">
        <div className="relative">
          {props.filter.selectedEvent === null ? (
            <DefaultFilterEvent
              count={99}
              onClick={() => handleEventChange(null)}
              isSelected
            />
          ) : (
            <FilterEvent
              event={props.filter.selectedEvent}
              onClick={handleEventChange}
              isSelected
            />
          )}
          <p className="absolute whitespace-nowrap text-[16px] text-white wv-bold wv-ibmplex px-[16px] py-[8px] top-[-40px] left-[-50%] bg-blue6 rounded-l-full rounded-tr-full shrink-0">
            สำรวจข้อถกเถียง
          </p>
        </div>
        <div className="w-[12px] h-[12px] bg-blue2 rounded-full shrink-0" />
        <div className="flex gap-[16px] w-full overflow-scroll no-scrollbar">
          {props.events.map((event) => (
            <FilterEvent
              event={event}
              onClick={handleEventChange}
              key={`filter-event-${event.display_name}`}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-[12px] items-center justify-between w-full px-[24px]">
        <div className="flex gap-[4px] items-center w-full shrink-2">
          <span className="text-blue7 text-nowrap">เรียงลำดับ:</span>
          <div className="flex w-[130px] text-[13px]">
            <button
              style={{
                backgroundColor:
                  props.filter.sortedBy === "most-commented"
                    ? "#2579F5"
                    : "transparent",
                color:
                  props.filter.sortedBy === "most-commented"
                    ? "#FFFFFF"
                    : "#95D0FF",
                borderColor:
                  props.filter.sortedBy === "most-commented"
                    ? "#1C4CD3"
                    : "#95D0FF",
              }}
              className="w-full py-[6px] rounded-l-[48px] border-[1px] border-solid"
              onClick={() => handleSortChange("most-commented")}
            >
              มากที่สุด
            </button>
            <button
              style={{
                backgroundColor:
                  props.filter.sortedBy === "latest"
                    ? "#2579F5"
                    : "transparent",
                color:
                  props.filter.sortedBy === "latest" ? "#FFFFFF" : "#95D0FF",
                borderColor:
                  props.filter.sortedBy === "latest" ? "#1C4CD3" : "#95D0FF",
              }}
              className="w-full py-[6px] rounded-r-[48px] border-[1px] border-solid"
              onClick={() => handleSortChange("latest")}
            >
              ล่าสุด
            </button>
          </div>
        </div>
        <div className="flex gap-[4px] items-center w-full overflow-scroll">
          <span className="text-blue7 text-nowrap">หัวข้อ:</span>
          <div className="flex overflow-scroll text-[13px] gap-[8px] no-scrollbar">
            {topicFilterCategories.map((category) => (
              <button
                key={category}
                className={`whitespace-nowrap px-[12px] py-[6px] border-solid border-[1.5px] rounded-[48px] ${
                  props.filter.category === category
                    ? "bg-blue6 text-white"
                    : "border-blue3 text-blue3"
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="relative w-[150px]">
          <input
            type="text"
            placeholder="ค้นหา"
            className="bg-white w-[150px] border border-blue3 outline-none px-[8px] py-[6px] rounded-[48px]"
            value={textSearch}
            onChange={(e) => {
              setTextSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchTextChange(textSearch);
                setTextSearch("");
              }
            }}
          />
          <img
            className="absolute right-[8px] top-1/2 transform -translate-y-1/2 hover:cursor-pointer"
            src="/icon/search.svg"
            alt="search-icon"
            onClick={() => {
              handleSearchTextChange(textSearch);
              setTextSearch("");
            }}
          />
        </div>
      </div>
    </div>
  );
}
