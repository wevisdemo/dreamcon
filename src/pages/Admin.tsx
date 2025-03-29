import React, { useEffect } from "react";
import EventCard from "../components/admin/EventCard";
import { mockEvent } from "../data/event";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ModalEvent from "../components/admin/ModalEvent";
import { DreamConEvent } from "../types/event";

const AdminPage = () => {
  enum RoomSortOption {
    LATEST,
    POPULAR,
  }
  const [filter, setFilter] = React.useState<RoomSortOption>(
    RoomSortOption.LATEST
  );
  const [modalEvent, setModalEvent] = React.useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    defaultState?: DreamConEvent;
  }>({ isOpen: true, mode: "create" });

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="h-full w-screen bg-blue2 flex justify-center relative">
      <main className="max-w-[940px] w-full py-[32px] flex flex-col gap-[32px]">
        <div className="flex justify-center gap-[12px] items-center mb-4">
          <div className="flex flex-col items-center">
            <div className="relative flex flex-col items-center wv-ibmplex text-center">
              <div className=" top-0 bg-white w-full px-[16px] py-[8px] rounded-l-[20px] rounded-tr-[20px] text-blue7 text-[16px] font-bold">
                ทั้งหมด
              </div>
              <div className="bg-white rounded-full h-[86px] w-[86px] flex items-center justify-center text-[36px] font-bold text-blue7">
                5
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
            <div className="text-blue7 text-4xl h-[24px]">+</div>
            <div className="text-blue7 text-[16px] font-bold">เพิ่มวงสนทนา</div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4 gap-[30px] text-[13px]">
          <div className="flex gap-[4px] items-center">
            <span className="text-blue7 text-nowrap">เรียงลำดับ:</span>
            <div className="flex w-[300px] text-[13px]">
              <button
                style={{
                  backgroundColor:
                    filter === RoomSortOption.LATEST
                      ? "#1C4CD3"
                      : "transparent",
                  color:
                    filter === RoomSortOption.LATEST ? "#FFFFFF" : "#1C4CD3",
                }}
                className="w-full py-[6px] rounded-l-[48px] border-[1px] border-solid border-[#1C4CD3] "
                onClick={() => setFilter(RoomSortOption.LATEST)}
              >
                เพิ่มล่าสุด
              </button>
              <button
                style={{
                  backgroundColor:
                    filter === RoomSortOption.POPULAR
                      ? "#1C4CD3"
                      : "transparent",
                  color:
                    filter === RoomSortOption.POPULAR ? "#FFFFFF" : "#1C4CD3",
                }}
                className="w-full py-[6px] rounded-r-[48px] border-[1px] border-solid border-[#1C4CD3] "
                onClick={() => setFilter(RoomSortOption.POPULAR)}
              >
                ข้อถกเถียงมากที่สุด
              </button>
            </div>
          </div>
          <div className="relative w-full">
            <input
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
        <EventCard event={mockEvent} />
      </main>
      <ModalEvent
        mode={modalEvent.mode}
        isOpen={modalEvent.isOpen}
        onClose={() => {
          setModalEvent({ ...modalEvent, isOpen: false });
        }}
        defaultState={modalEvent.defaultState}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default AdminPage;
