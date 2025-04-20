import { useEffect, useState } from "react";
import EventCard from "../components/admin/EventCard";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ModalEvent from "../components/admin/ModalEvent";
import { AddOrEditEventPayload, DreamConEvent } from "../types/event";
import { useEvent } from "../hooks/useEvent";
import { useWriter } from "../hooks/useWriter";
import FullPageLoader from "../components/FullPageLoader";
import DefaultLayout from "../layouts/default";

const AdminPage = () => {
  enum RoomSortOption {
    LATEST,
    POPULAR,
  }
  const [sortBy, setSortBy] = useState<RoomSortOption>(RoomSortOption.LATEST);
  const [searchText, setSearchText] = useState<string>("");
  const [modalEvent, setModalEvent] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    defaultState?: DreamConEvent;
  }>({ isOpen: false, mode: "create" });
  const [events, setEvents] = useState<DreamConEvent[]>([]);
  const [displayEvents, setDisplayEvents] = useState<DreamConEvent[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const regex = new RegExp(searchText, "i");
    const filteredEvents = events.filter((event) => {
      return regex.test(event.display_name);
    });
    switch (sortBy) {
      case RoomSortOption.LATEST:
        setDisplayEvents(
          [...filteredEvents].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        );
        break;
      case RoomSortOption.POPULAR:
        setDisplayEvents(
          [...filteredEvents].sort((a, b) => b.topic_counts - a.topic_counts)
        );
        break;
    }
  }, [sortBy, events, searchText]);

  const {
    createEvent,
    editEvent,
    getEvents,
    loading: eventLoading,
  } = useEvent();
  const { createWriter, loading: writerLoading } = useWriter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmitEvent = async (
    mode: "create" | "edit",
    payload: AddOrEditEventPayload
  ) => {
    if (mode === "edit") {
      await handleEditEvent(payload);
    } else {
      await handleCreateEvent(payload);
    }
    setModalEvent({ defaultState: undefined, mode: "create", isOpen: false });
    fetchEvents();
  };

  const handleCopyWriterLink = async (eventId: string) => {
    const writerID = await createWriter({ event_id: eventId });
    if (!writerID) {
      return;
    }
    const link = `${window.origin}/?writer=${writerID}`;
    navigator.clipboard.writeText(link);
  };

  const handleJumpToHomePage = async (eventId: string) => {
    const writerID = await createWriter({ event_id: eventId });
    if (!writerID) {
      return;
    }
    const link = `${window.origin}/topics/?writer=${writerID}&event=${eventId}`;
    window.location.href = link;
  };

  const handleCreateEvent = async (payload: AddOrEditEventPayload) => {
    await createEvent(payload);
  };

  const handleEditEvent = async (payload: AddOrEditEventPayload) => {
    if (!modalEvent.defaultState) return;

    await editEvent(modalEvent.defaultState.id, payload);
  };

  const fetchEvents = async () => {
    const events = await getEvents();
    if (!events) {
      alert("Failed to fetch events.");
      return;
    }
    setEvents(events);
    setDisplayEvents(events);
  };

  const isPageLoading = () => {
    return eventLoading || writerLoading;
  };

  return (
    <DefaultLayout page="admin">
      {isPageLoading() ? <FullPageLoader /> : null}
      <div className="h-full w-screen bg-blue2 flex justify-center relative overflow-auto">
        <main className="max-w-[940px] w-full py-[32px] flex flex-col ">
          <div className="flex justify-center gap-[12px] items-center mb-4 mb-[32px]">
            <div className="flex flex-col items-center">
              <div className="relative flex flex-col items-center wv-ibmplex text-center">
                <div className=" top-0 bg-white w-full px-[16px] py-[8px] rounded-l-[20px] rounded-tr-[20px] text-blue7 text-[16px] font-bold">
                  ทั้งหมด
                </div>
                <div className="bg-white rounded-full h-[86px] w-[86px] flex items-center justify-center text-[36px] font-bold text-blue7">
                  {displayEvents.length}
                </div>
                <div className=" bottom-0 bg-white w-full px-2 rounded-full text-blue7 font-bold">
                  วงสนทนา
                </div>
              </div>
            </div>
            <div
              className="flex flex-col gap-[16px] items-center justify-center w-[150px] h-[150px] border-2 border-dashed border-blue7 rounded-full wv-ibmplex hover:cursor-pointer"
              onClick={() => {
                setModalEvent({ ...modalEvent, isOpen: true });
              }}
            >
              <div className="text-blue7 text-[48px] leading-[24px]">+</div>
              <div className="text-blue7 text-[16px] font-bold">
                เพิ่มวงสนทนา
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4 gap-[30px] text-[13px]">
            <div className="flex gap-[4px] items-center">
              <span className="text-blue7 text-nowrap">เรียงลำดับ:</span>
              <div className="flex w-[300px] text-[13px]">
                <button
                  style={{
                    backgroundColor:
                      sortBy === RoomSortOption.LATEST
                        ? "#1C4CD3"
                        : "transparent",
                    color:
                      sortBy === RoomSortOption.LATEST ? "#FFFFFF" : "#1C4CD3",
                  }}
                  className="w-full py-[6px] rounded-l-[48px] border-[1px] border-solid border-[#1C4CD3] "
                  onClick={() => setSortBy(RoomSortOption.LATEST)}
                >
                  เพิ่มล่าสุด
                </button>
                <button
                  style={{
                    backgroundColor:
                      sortBy === RoomSortOption.POPULAR
                        ? "#1C4CD3"
                        : "transparent",
                    color:
                      sortBy === RoomSortOption.POPULAR ? "#FFFFFF" : "#1C4CD3",
                  }}
                  className="w-full py-[6px] rounded-r-[48px] border-[1px] border-solid border-[#1C4CD3] "
                  onClick={() => setSortBy(RoomSortOption.POPULAR)}
                >
                  ข้อถกเถียงมากที่สุด
                </button>
              </div>
            </div>
            <div className="relative w-full">
              <input
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                value={searchText}
                type="text"
                placeholder="ค้นหา"
                className="bg-white w-full border border-blue3 outline-none p-[8px] rounded-[48px]"
              />
              <img
                className="absolute right-[20px] top-1/2 transform -translate-y-1/2 hover:cursor-pointer"
                src="/icon/search.svg"
                alt="search-icon"
                onClick={() => {}}
              />
            </div>
          </div>
          <div className="flex flex-col gap-[32px] pb-[32px]">
            {displayEvents.map((event, index) => (
              <EventCard
                index={index + 1}
                key={event.id}
                event={event}
                onClickShareLink={() => handleCopyWriterLink(event.id)}
                onClickCreateDebate={() => {
                  handleJumpToHomePage(event.id);
                }}
                onClickEdit={() => {
                  setModalEvent({
                    ...modalEvent,
                    isOpen: true,
                    mode: "edit",
                    defaultState: event,
                  });
                }}
              />
            ))}
          </div>
        </main>
        <ModalEvent
          mode={modalEvent.mode}
          isOpen={modalEvent.isOpen}
          onClose={() => {
            setModalEvent({ ...modalEvent, isOpen: false });
          }}
          defaultState={modalEvent.defaultState}
          onSubmit={handleSubmitEvent}
        />
      </div>
    </DefaultLayout>
  );
};

export default AdminPage;
