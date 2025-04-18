// import { Topic } from "../types/topic";
// import {
//   mockComments1,
//   mockComments2,
//   mockComments3,
//   mockComments4,
//   mockComments5,
// } from "./comment";
// export const mockTopic1: Topic = {
//   id: "T1",
//   title: `กรณี สสร มาจากพรรคการเมือง ควรให้พรรคการ เมือง "กรอง" คุณสมบัติให้ด้วย ถือว่าเป็นการเน้นย้ำ เจตนารมณ์ + เช็คว่าไม่ได้มีตำแหน่งทางการเมือง`,
//   comments: [...mockComments1, ...mockComments2, ...mockComments3],
//   created_at: new Date("2023-10-01T00:00:00.000Z"),
//   updated_at: new Date("2023-10-01T00:00:00.000Z"),
//   notified_at: new Date("2023-10-01T00:00:00.000Z"),
// };

// const mockTopic2: Topic = {
//   id: "T2",
//   title: `กรณี สสร มาจากพรรคการเมือง ควรให้พรรคการ เมือง "กรอง" คุณสมบัติให้ด้วย ถือว่าเป็นการเน้นย้ำ เจตนารมณ์ + เช็คว่าไม่ได้มีตำแหน่งทางการเมือง`,
//   comments: [...mockComments2, ...mockComments4],
//   created_at: new Date("2023-10-01T00:00:00.000Z"),
//   updated_at: new Date("2023-10-01T00:00:00.000Z"),
//   notified_at: new Date("2023-10-01T00:00:00.000Z"),
// };

// const mockTopic3: Topic = {
//   id: "T3",
//   title: `กรณี สสร มาจากพรรคการเมือง ควรให้พรรคการ เมือง "กรอง" คุณสมบัติให้ด้วย ถือว่าเป็นการเน้นย้ำ เจตนารมณ์ + เช็คว่าไม่ได้มีตำแหน่งทางการเมือง`,
//   comments: [...mockComments1, ...mockComments5],
//   created_at: new Date("2023-10-01T00:00:00.000Z"),
//   updated_at: new Date("2023-10-01T00:00:00.000Z"),
//   notified_at: new Date("2023-10-01T00:00:00.000Z"),
// };

// export const mockTopic4: Topic = {
//   id: "T4",
//   title: `กรณี สสร มาจากพรรคการเมือง ควรให้พรรคการ เมือง "กรอง" คุณสมบัติให้ด้วย ถือว่าเป็นการเน้นย้ำ เจตนารมณ์ + เช็คว่าไม่ได้มีตำแหน่งทางการเมือง`,
//   comments: [...mockComments3, ...mockComments4],
//   created_at: new Date("2023-10-01T00:00:00.000Z"),
//   updated_at: new Date("2023-10-01T00:00:00.000Z"),
//   notified_at: new Date("2023-10-01T00:00:00.000Z"),
// };

// const mockTopic5: Topic = {
//   id: "T5",
//   title: `การปฏิรูปการเมืองในประเทศไทยควรเริ่มต้นจากจุดใด และมีแนวทางอย่างไรในการสร้างความโปร่งใสและความยุติธรรมในระบบการเมือง`,
//   comments: [...mockComments2, ...mockComments5],
//   created_at: new Date("2023-10-01T00:00:00.000Z"),
//   updated_at: new Date("2023-10-01T00:00:00.000Z"),
//   notified_at: new Date("2023-10-01T00:00:00.000Z"),
// };

// const mockTopic6: Topic = {
//   id: "T6",
//   title: `การมีส่วนร่วมของประชาชนในการตัดสินใจทางการเมืองมีความสำคัญอย่างไร และควรมีวิธีการใดในการส่งเสริมการมีส่วนร่วมนี้`,
//   comments: [...mockComments1, ...mockComments4],
//   created_at: new Date("2023-10-01T00:00:00.000Z"),
//   updated_at: new Date("2023-10-01T00:00:00.000Z"),
//   notified_at: new Date("2023-10-01T00:00:00.000Z"),
// };

// const mockTopic7: Topic = {
//   id: "T7",
//   title: `การจัดการกับปัญหาคอร์รัปชันในระบบการเมืองไทยควรมีมาตรการใดบ้าง และควรมีการบังคับใช้กฎหมายอย่างไรเพื่อให้เกิดผลที่มีประสิทธิภาพ`,
//   comments: [...mockComments3, ...mockComments5],
//   created_at: new Date("2023-10-01T00:00:00.000Z"),
//   updated_at: new Date("2023-10-01T00:00:00.000Z"),
//   notified_at: new Date("2023-10-01T00:00:00.000Z"),
// };

// const mockTopic8: Topic = {
//   id: "T8",
//   title: `การพัฒนาระบบการเลือกตั้งในประเทศไทยควรมีการปรับปรุงอย่างไรเพื่อให้เกิดความยุติธรรมและเป็นธรรมต่อทุกฝ่าย`,
//   comments: [...mockComments2, ...mockComments4],
//   created_at: new Date("2023-10-01T00:00:00.000Z"),
//   updated_at: new Date("2023-10-01T00:00:00.000Z"),
//   notified_at: new Date("2023-10-01T00:00:00.000Z"),
// };

// const mockTopic9: Topic = {
//   id: "T9",
//   title: `การสร้างความเชื่อมั่นในระบบการเมืองไทยควรมีการดำเนินการอย่างไรเพื่อให้ประชาชนมีความเชื่อมั่นและไว้วางใจในระบบการเมือง`,
//   comments: [...mockComments1, ...mockComments5],
//   created_at: new Date("2023-10-01T00:00:00.000Z"),
//   updated_at: new Date("2023-10-01T00:00:00.000Z"),
//   notified_at: new Date("2023-10-01T00:00:00.000Z"),
// };

// const mockTopic10: Topic = {
//   id: "T10",
//   title: `การส่งเสริมการมีส่วนร่วมของเยาวชนในการเมืองควรมีวิธีการใดบ้างเพื่อให้เยาวชนมีความสนใจและมีบทบาทในการพัฒนาประเทศ`,
//   comments: [...mockComments3, ...mockComments4],
//   created_at: new Date("2023-10-01T00:00:00.000Z"),
//   updated_at: new Date("2023-10-01T00:00:00.000Z"),
//   notified_at: new Date("2023-10-01T00:00:00.000Z"),
// };

// export const mockTopics: Topic[] = [
//   mockTopic1,
//   mockTopic2,
//   mockTopic3,
//   mockTopic4,
//   mockTopic5,
//   mockTopic6,
//   mockTopic7,
//   mockTopic8,
//   mockTopic9,
//   mockTopic10,
// ];
