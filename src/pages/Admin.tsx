import React from "react";

const Admin = () => {
  enum RoomSortOption {
    LATEST,
    POPULAR,
  }
  const [filter, setFilter] = React.useState<RoomSortOption>(
    RoomSortOption.LATEST
  );
  return (
    <div className="min-h-screen w-screen bg-blue2 flex justify-center">
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
            onClick={() => {}}
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
        <div className="bg-white p-4 rounded shadow mb-4">
          <div className="flex items-center mb-4">
            <div className="bg-blue-200 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold">
              5
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">Prisoners’ Dream Con</h2>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                แก้ไขข้อมูล
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold">
              Dream Constitution for Future of Freedom
            </h3>
            <p>เติมจินตนาการ ต่อความฝันให้ประเทศไทย...</p>
            <a
              href="https://www.facebook.com/share/p/18UCTjpauy/"
              className="text-blue-500"
            >
              ลิงก์ข่าว
            </a>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold">สร้างข้อถกเถียงของวงสนทนานี้</h3>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            แชร์ลิงก์
          </button>
        </div>
      </main>
    </div>
  );
};

export default Admin;
