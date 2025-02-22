import { Comment, CommentView } from "../types/comment";

export const mockComments1: Comment[] = [
  {
    id: "A1",
    comment_view: CommentView.AGREE,
    reason:
      "เพราะ..การเป็นสมาชิกพรรคการเมืองแสดงถึงการต้องการมีส่วนร่วมทางการเมือง",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
];

export const mockComments2: Comment[] = [
  {
    id: "P1",
    comment_view: CommentView.AGREE,
    reason:
      "เพราะ..สสร จากพรรคการเมืองไม่ผิด แต่ควร declare อย่างชัดเจนว่าผู้สมัครมีจุดยืนทางการเมือง/จุดยืนเรื่องการแก้ รธน อย่างไร",
    comments: [
      {
        id: "P11",
        comment_view: CommentView.DISAGREE,
        reason:
          "เพราะ..การเป็นสมาชิกพรรคการเมืองแสดงถึงการต้องการมีส่วนร่วมทางการเมือง",
        comments: [],
        created_at: "2023-10-01T00:00:00.000Z",
        updated_at: "2023-10-01T00:00:00.000Z",
      },
      {
        id: "P12",
        comment_view: CommentView.PARTIAL_AGREE,
        reason: "เพราะ..ผู้เลือกต้องรู้ว่าคนที่เราเลือกเป็นใคร จะทำอะไร",
        comments: [],
        created_at: "2023-10-01T00:00:00.000Z",
        updated_at: "2023-10-01T00:00:00.000Z",
      },
    ],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "P2",
    comment_view: CommentView.PARTIAL_AGREE,
    reason: "เพราะ..",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
];

export const mockComments3: Comment[] = [
  {
    id: "D1",
    comment_view: CommentView.DISAGREE,
    reason:
      "เพราะ..ผู้สมัคร สสร. จำเป็นต้องแยกขาดจากพรรคการเมือง เพื่อให้สะท้อนความเป็นอิสร",
    comments: [
      {
        id: "D11",
        comment_view: CommentView.AGREE,
        reason: "จะเป็นตัวแทนประชาชนแล้ว ไม่จำเป็นต้องเป็นสมาชิกพรรคการเมือง",
        comments: [],
        created_at: "2023-10-01T00:00:00.000Z",
        updated_at: "2023-10-01T00:00:00.000Z",
      },
      {
        id: "D12",
        comment_view: CommentView.PARTIAL_AGREE,
        reason:
          "สามารถเป็นสมาชิกพรรคได้ แต่ต้องเว้นวรรคจากการดำรงตำแหน่งทางการเมืองมาไม่น้อยกว่า 5 ปี",
        comments: [
          {
            id: "D121",
            comment_view: CommentView.DISAGREE,
            reason: "ไม่ต้องเว้นวรรคก็ได้ แค่ต้องลาออก ณ วันที่สมัคร",
            comments: [],
            created_at: "2023-10-01T00:00:00.000Z",
            updated_at: "2023-10-01T00:00:00.000Z",
          },
        ],
        created_at: "2023-10-01T00:00:00.000Z",
        updated_at: "2023-10-01T00:00:00.000Z",
      },
      {
        id: "D13",
        comment_view: CommentView.PARTIAL_AGREE,
        reason:
          "คิดว่าควรออกแบบกลไกไม่ให้เห็นการเสนอจากพรรคการเมืองแบบโจ่งแจ้งเพราะจะเป็นการสร้างความขัดแย้งทางความเห็น/สนามการเมือง",
        comments: [],
        created_at: "2023-10-01T00:00:00.000Z",
        updated_at: "2023-10-01T00:00:00.000Z",
      },
      {
        id: "D14",
        comment_view: CommentView.PARTIAL_AGREE,
        reason:
          "สสร.ไม่ควรยึดโยงกับพรรคการเมืองหรือกลุ่มการเมืองอื่นๆ เช่น สว.",
        comments: [],
        created_at: "2023-10-01T00:00:00.000Z",
        updated_at: "2023-10-01T00:00:00.000Z",
      },
    ],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "D2",
    comment_view: CommentView.DISAGREE,
    reason: "เพราะ..ไม่ควร เพราะจะไม่ต่างกับการให้ สส.ร่างรัฐธรรมนูญ",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
];

export const mockComments4: Comment[] = [
  {
    id: "R1",
    comment_view: CommentView.AGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนเป็นสิ่งสำคัญ",
    comments: [
      {
        id: "R11",
        comment_view: CommentView.DISAGREE,
        reason: "เพราะ..การมีส่วนร่วมของประชาชนอาจทำให้เกิดความขัดแย้ง",
        comments: [
          {
            id: "R111",
            comment_view: CommentView.PARTIAL_AGREE,
            reason: "เพราะ..การมีส่วนร่วมของประชาชนควรมีการจัดการที่ดี",
            comments: [],
            created_at: "2023-10-01T00:00:00.000Z",
            updated_at: "2023-10-01T00:00:00.000Z",
          },
        ],
        created_at: "2023-10-01T00:00:00.000Z",
        updated_at: "2023-10-01T00:00:00.000Z",
      },
      {
        id: "R12",
        comment_view: CommentView.PARTIAL_AGREE,
        reason: "เพราะ..การมีส่วนร่วมของประชาชนต้องมีการควบคุม",
        comments: [],
        created_at: "2023-10-01T00:00:00.000Z",
        updated_at: "2023-10-01T00:00:00.000Z",
      },
    ],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "R2",
    comment_view: CommentView.AGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนอาจทำให้เกิดความขัดแย้ง",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "R3",
    comment_view: CommentView.PARTIAL_AGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนควรมีการกำกับดูแล",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "R4",
    comment_view: CommentView.AGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนช่วยสร้างความโปร่งใส",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "R5",
    comment_view: CommentView.AGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนอาจทำให้เกิดความล่าช้า",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "R6",
    comment_view: CommentView.AGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนควรมีการประเมินผล",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "R7",
    comment_view: CommentView.AGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนช่วยสร้างความเป็นธรรม",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
];

export const mockComments5: Comment[] = [
  {
    id: "S1",
    comment_view: CommentView.DISAGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนควรมีขอบเขต",
    comments: [
      {
        id: "S11",
        comment_view: CommentView.AGREE,
        reason: "เพราะ..การมีส่วนร่วมของประชาชนเป็นสิ่งที่ดี",
        comments: [
          {
            id: "S111",
            comment_view: CommentView.DISAGREE,
            reason: "เพราะ..การมีส่วนร่วมของประชาชนอาจทำให้เกิดความขัดแย้ง",
            comments: [],
            created_at: "2023-10-01T00:00:00.000Z",
            updated_at: "2023-10-01T00:00:00.000Z",
          },
        ],
        created_at: "2023-10-01T00:00:00.000Z",
        updated_at: "2023-10-01T00:00:00.000Z",
      },
      {
        id: "S12",
        comment_view: CommentView.DISAGREE,
        reason: "เพราะ..การมีส่วนร่วมของประชาชนอาจทำให้เกิดความขัดแย้ง",
        comments: [],
        created_at: "2023-10-01T00:00:00.000Z",
        updated_at: "2023-10-01T00:00:00.000Z",
      },
    ],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "S2",
    comment_view: CommentView.DISAGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนเป็นสิ่งที่ดี",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "S3",
    comment_view: CommentView.DISAGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนอาจทำให้เกิดความขัดแย้ง",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "S4",
    comment_view: CommentView.DISAGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนควรมีการกำกับดูแล",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "S5",
    comment_view: CommentView.DISAGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนช่วยสร้างความโปร่งใส",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "S6",
    comment_view: CommentView.DISAGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนอาจทำให้เกิดความล่าช้า",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "S7",
    comment_view: CommentView.PARTIAL_AGREE,
    reason: "เพราะ..การมีส่วนร่วมของประชาชนควรมีการประเมินผล",
    comments: [],
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
];
