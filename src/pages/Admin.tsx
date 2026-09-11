import { useEffect, useState } from 'react';
import EventCard from '../components/admin/EventCard';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ModalEvent from '../components/admin/ModalEvent';
import { AddOrEditEventPayload, DreamConEvent } from '../types/event';
import { useEvent } from '../hooks/useEvent';
import { useWriter } from '../hooks/useWriter';
import FullPageLoader from '../components/FullPageLoader';
import DefaultLayout from '../layouts/default';

enum RoomSortOption {
  LATEST_EVENT,
  LATEST_CREATED,
  POPULAR,
}

const AdminPage = () => {
  const [sortBy, setSortBy] = useState<RoomSortOption>(
    RoomSortOption.LATEST_EVENT
  );
  const [searchText, setSearchText] = useState<string>('');
  const [modalEvent, setModalEvent] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    defaultState?: DreamConEvent;
  }>({ isOpen: false, mode: 'create' });
  const [events, setEvents] = useState<DreamConEvent[]>([]);
  const [displayEvents, setDisplayEvents] = useState<DreamConEvent[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const regex = new RegExp(searchText, 'i');
    const filteredEvents = events.filter(event => {
      return regex.test(event.display_name);
    });
    switch (sortBy) {
      case RoomSortOption.LATEST_EVENT:
        setDisplayEvents(
          [...filteredEvents].sort((a, b) => b.date.localeCompare(a.date))
        );
        break;
      case RoomSortOption.LATEST_CREATED:
        setDisplayEvents(
          [...filteredEvents].sort(
            (a, b) => b.created_at.getTime() - a.created_at.getTime()
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
  const {
    createWriter,
    loading: writerLoading,
    getPermanentWriterByEventID,
  } = useWriter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        navigate('/admin/login', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once on mount
  }, []);

  const handleSubmitEvent = async (
    mode: 'create' | 'edit',
    payload: AddOrEditEventPayload
  ) => {
    if (mode === 'edit') {
      await handleEditEvent(payload);
    } else {
      await handleCreateEvent(payload);
    }
    setModalEvent({ defaultState: undefined, mode: 'create', isOpen: false });
    fetchEvents();
  };

  const handleCopyWriterLink = async (eventId: string) => {
    const writerID = await createWriter({ event_id: eventId });
    if (!writerID) {
      return;
    }
    const link = `${window.origin}/topics/?writer=${writerID}`;
    navigator.clipboard.writeText(link);
  };

  const handleJumpToHomePage = async (eventId: string) => {
    let writerID = '';
    const permanentWriter = await getPermanentWriterByEventID(eventId);
    if (!permanentWriter) {
      writerID = await createWriter({ event_id: eventId, is_permanent: true });
    } else {
      writerID = permanentWriter.id;
    }
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
      alert('Failed to fetch events.');
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
      <div className="h-full w-screen bg-blue-2 flex justify-center relative overflow-auto">
        <main className="max-w-235 w-full py-8 flex flex-col">
          <div className="flex justify-center gap-3 items-center mb-4">
            <div className="flex flex-col items-center">
              <div className="relative flex flex-col items-center wv-ibmplex text-center">
                <div className=" top-0 bg-white w-full px-4 py-2 rounded-l-[20px] rounded-tr-[20px] text-blue-7 text-b2 font-bold">
                  ทั้งหมด
                </div>
                <div className="bg-white rounded-full h-21.5 w-21.5 flex items-center justify-center heading-2 font-bold text-blue-7">
                  {displayEvents.length}
                </div>
                <div className=" bottom-0 bg-white w-full px-2 rounded-full text-blue-7 font-bold">
                  วงสนทนา
                </div>
              </div>
            </div>
            <div
              className="flex flex-col gap-4 items-center justify-center w-37.5 h-37.5 border-2 border-dashed border-blue-7 rounded-full wv-ibmplex hover:cursor-pointer"
              onClick={() => {
                setModalEvent({ ...modalEvent, isOpen: true });
              }}
            >
              <div className="text-blue-7 heading-1 leading-none">+</div>
              <div className="text-blue-7 text-b2 font-bold">เพิ่มวงสนทนา</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4 gap-7.5 text-b3">
            <div className="flex gap-1 items-center">
              <span className="text-blue-7 text-nowrap">เรียงลำดับ:</span>
              <div className="flex w-128 text-b3">
                <button
                  className={`w-full py-1.5 rounded-l-full border border-solid border-blue-7 ${
                    sortBy === RoomSortOption.LATEST_EVENT
                      ? 'bg-blue-7 text-white'
                      : 'text-blue-7'
                  }`}
                  onClick={() => setSortBy(RoomSortOption.LATEST_EVENT)}
                >
                  วันที่จัดล่าสุด
                </button>
                <button
                  className={`w-full py-1.5 border-y border-solid border-blue-7 ${
                    sortBy === RoomSortOption.LATEST_CREATED
                      ? 'bg-blue-7 text-white'
                      : 'text-blue-7'
                  }`}
                  onClick={() => setSortBy(RoomSortOption.LATEST_CREATED)}
                >
                  เพิ่มล่าสุด
                </button>
                <button
                  className={`w-full py-1.5 rounded-r-full border border-solid border-blue-7 ${
                    sortBy === RoomSortOption.POPULAR
                      ? 'bg-blue-7 text-white'
                      : 'text-blue-7'
                  }`}
                  onClick={() => setSortBy(RoomSortOption.POPULAR)}
                >
                  ข้อถกเถียงมากที่สุด
                </button>
              </div>
            </div>
            <div className="relative w-full">
              <input
                onChange={e => {
                  setSearchText(e.target.value);
                }}
                value={searchText}
                type="text"
                placeholder="ค้นหา"
                className="bg-white w-full border border-blue-3 outline-none p-2 rounded-full"
              />
              <img
                className="absolute right-5 top-1/2 transform -translate-y-1/2 hover:cursor-pointer"
                src="/icon/search.svg"
                alt="search-icon"
                onClick={() => {}}
              />
            </div>
          </div>
          <div className="flex flex-col gap-8 pb-8">
            {displayEvents.map((event, i) => (
              <EventCard
                index={i + 1}
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
                    mode: 'edit',
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
