import { useEffect, useState } from 'react';
import SearchIcon from '@material-symbols/svg-700/rounded/search.svg?react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/admin/EventCard';
import ModalEvent from '../components/admin/ModalEvent';
import FullPageLoader from '../components/ui/FullPageLoader';
import { useEvent } from '../hooks/useEvent';
import { useWriter } from '../hooks/useWriter';
import DefaultLayout from '../layouts/default';
import { AddOrEditEventPayload, DreamConEvent } from '../types/event';

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
    <DefaultLayout admin>
      {isPageLoading() ? <FullPageLoader /> : null}
      <div className="relative flex h-full w-screen justify-center overflow-auto bg-blue-2">
        <main className="flex w-full max-w-235 flex-col py-8">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex flex-col items-center">
              <div className="wv-ibmplex relative flex flex-col items-center text-center">
                <div className="top-0 w-full rounded-l-[20px] rounded-tr-[20px] bg-white px-4 py-2 text-b2 font-bold text-blue-7">
                  ทั้งหมด
                </div>
                <div className="flex h-21.5 w-21.5 items-center justify-center rounded-full bg-white heading-2 font-bold text-blue-7">
                  {displayEvents.length}
                </div>
                <div className="bottom-0 w-full rounded-full bg-white px-2 font-bold text-blue-7">
                  วงสนทนา
                </div>
              </div>
            </div>
            <div
              className="wv-ibmplex flex h-37.5 w-37.5 flex-col items-center justify-center gap-4 rounded-full border-2 border-dashed border-blue-7 hover:cursor-pointer"
              onClick={() => {
                setModalEvent({ ...modalEvent, isOpen: true });
              }}
            >
              <div className="heading-1 leading-none text-blue-7">+</div>
              <div className="text-b2 font-bold text-blue-7">เพิ่มวงสนทนา</div>
            </div>
          </div>
          <div className="mb-4 flex items-center justify-between gap-7.5 text-b3">
            <div className="flex items-center gap-1">
              <span className="text-nowrap text-blue-7">เรียงลำดับ:</span>
              <div className="flex w-128 text-b3">
                <button
                  className={`w-full rounded-l-full border border-solid border-blue-7 py-1.5 ${
                    sortBy === RoomSortOption.LATEST_EVENT
                      ? 'bg-blue-7 text-white'
                      : 'text-blue-7'
                  }`}
                  onClick={() => setSortBy(RoomSortOption.LATEST_EVENT)}
                >
                  วันที่จัดล่าสุด
                </button>
                <button
                  className={`w-full border-y border-solid border-blue-7 py-1.5 ${
                    sortBy === RoomSortOption.LATEST_CREATED
                      ? 'bg-blue-7 text-white'
                      : 'text-blue-7'
                  }`}
                  onClick={() => setSortBy(RoomSortOption.LATEST_CREATED)}
                >
                  เพิ่มล่าสุด
                </button>
                <button
                  className={`w-full rounded-r-full border border-solid border-blue-7 py-1.5 ${
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
                className="w-full rounded-full border border-blue-3 bg-white p-2 outline-none"
              />
              <SearchIcon
                className="absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 transform text-blue-5 hover:cursor-pointer"
                aria-hidden
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
