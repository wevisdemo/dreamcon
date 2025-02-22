import { Topic } from "../types/topic";
import { mockComments1, mockComments2, mockComments3 } from "./comment";

export const mockTopic1: Topic = {
  id: "T1",
  title: `กรณี สสร มาจากพรรคการเมือง ควรให้พรรคการ เมือง "กรอง" คุณสมบัติให้ด้วย ถือว่าเป็นการเน้นย้ำ เจตนารมณ์ + เช็คว่าไม่ได้มีตำแหน่งทางการเมือง`,
  comments: [...mockComments1, ...mockComments2, ...mockComments3],
  created_at: "2023-10-01T00:00:00.000Z",
  updated_at: "2023-10-01T00:00:00.000Z",
};
