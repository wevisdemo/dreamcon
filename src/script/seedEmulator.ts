/**
 * Seeds the local Firebase emulators with a fixed dataset.
 *
 * The emulators keep everything in memory and this script wipes them first, so
 * every startup begins from exactly the same state. Edit the fixtures below to
 * change what "initial state" means.
 */
import { doc, writeBatch } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { initDB } from './firestore';
import { CommentView } from '../types/comment';
import type { CommentDB } from '../types/comment';
import type { DreamConEventDB } from '../types/event';
import type { TopicDB } from '../types/topic';
import type { Writer } from '../types/writer';
import { eventAvatars } from '../data/event';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  AUTH_EMULATOR_PORT,
  EMULATOR_FIREBASE_CONFIG,
  EMULATOR_HOST,
  FIRESTORE_EMULATOR_PORT,
} from '../utils/firebaseEmulator';

// Force emulator mode so this script can never reach the production project.
// `initDB` reads this when it is called, below.
process.env.VITE_USE_FIREBASE_EMULATOR = 'true';

/** Fixed clock so seeded documents are byte-identical on every run. */
const NOW = new Date('2025-06-01T09:00:00.000Z');
const daysFromSeed = (days: number) =>
  new Date(NOW.getTime() + days * 24 * 60 * 60 * 1000);

const events: DreamConEventDB[] = [
  {
    id: 'ev-bangkok',
    display_name: 'เวทีกรุงเทพฯ',
    avatar_url: eventAvatars[0],
    title_en: 'Dream Constitution Bangkok',
    title_th: 'รัฐธรรมนูญในฝัน กรุงเทพฯ',
    description: 'เวทีรับฟังความเห็นในเขตกรุงเทพมหานคร',
    location: 'กรุงเทพมหานคร',
    date: '2025-05-10',
    target_group: 'ประชาชนทั่วไป',
    participants: 120,
    news_link: 'https://example.org/news/bangkok',
    created_at: daysFromSeed(-30),
    updated_at: daysFromSeed(-2),
  },
  {
    id: 'ev-chiangmai',
    display_name: 'เวทีเชียงใหม่',
    avatar_url: eventAvatars[1],
    title_en: 'Dream Constitution Chiang Mai',
    title_th: 'รัฐธรรมนูญในฝัน เชียงใหม่',
    description: 'เวทีรับฟังความเห็นในภาคเหนือ',
    location: 'เชียงใหม่',
    date: '2025-05-18',
    target_group: 'นักเรียน นักศึกษา',
    participants: 65,
    news_link: '',
    created_at: daysFromSeed(-20),
    updated_at: daysFromSeed(-1),
  },
  {
    // Event with no topics of its own: covers the empty-state UI. It is still
    // linked to tp-parliament through the cm-parliament-6 comment.
    id: 'ev-online',
    display_name: 'เวทีออนไลน์',
    avatar_url: eventAvatars[2],
    title_en: 'Dream Constitution Online',
    title_th: 'รัฐธรรมนูญในฝัน ออนไลน์',
    description: 'เวทีรับฟังความเห็นผ่านช่องทางออนไลน์',
    location: 'ออนไลน์',
    date: '2025-06-01',
    target_group: 'ประชาชนทั่วไป',
    participants: 0,
    news_link: '',
    created_at: daysFromSeed(-5),
    updated_at: daysFromSeed(-5),
  },
];

/** Every category in `topicCategories` appears at least once. */
const topics: TopicDB[] = [
  {
    id: 'tp-rights',
    ref_id: 'SHEET-001',
    title: 'รัฐธรรมนูญควรรับรองเสรีภาพในการแสดงออกอย่างไร',
    category: 'สิทธิเสรีภาพ',
    event_ids: ['ev-bangkok'],
    created_at: daysFromSeed(-28),
    updated_at: daysFromSeed(-3),
    notified_at: daysFromSeed(-3),
  },
  {
    id: 'tp-parliament',
    title: 'ที่มาของสมาชิกวุฒิสภาควรเป็นแบบใด',
    category: 'รัฐสภา',
    event_ids: ['ev-bangkok'],
    created_at: daysFromSeed(-27),
    updated_at: daysFromSeed(-2),
    notified_at: daysFromSeed(-2),
  },
  {
    // No comments: covers the "topic without comment" UI and 0 in sort-by-count.
    id: 'tp-court',
    title: 'ศาลรัฐธรรมนูญควรมีอำนาจตรวจสอบเรื่องใดบ้าง',
    category: 'ศาล รธน.',
    event_ids: ['ev-bangkok'],
    created_at: daysFromSeed(-26),
    updated_at: daysFromSeed(-26),
    notified_at: daysFromSeed(-26),
  },
  {
    id: 'tp-environment',
    title: 'สิทธิในสิ่งแวดล้อมที่ดีควรถูกบัญญัติไว้หรือไม่',
    category: 'สิ่งแวดล้อม',
    event_ids: ['ev-bangkok'],
    created_at: daysFromSeed(-24),
    updated_at: daysFromSeed(-4),
    notified_at: daysFromSeed(-4),
  },
  {
    id: 'tp-welfare',
    title: 'รัฐสวัสดิการถ้วนหน้าควรเป็นหน้าที่ของรัฐหรือไม่',
    category: 'สวัสดิการ',
    event_ids: ['ev-bangkok'],
    created_at: daysFromSeed(-22),
    updated_at: daysFromSeed(-6),
    notified_at: daysFromSeed(-6),
  },
  {
    id: 'tp-other',
    title: 'ประเด็นอื่น ๆ ที่อยากเห็นในรัฐธรรมนูญฉบับใหม่',
    category: 'อื่น ๆ',
    event_ids: ['ev-bangkok'],
    created_at: daysFromSeed(-21),
    updated_at: daysFromSeed(-7),
    notified_at: daysFromSeed(-7),
  },
  {
    id: 'tp-local',
    ref_id: 'SHEET-002',
    title: 'ท้องถิ่นควรมีอำนาจจัดเก็บภาษีของตัวเองหรือไม่',
    category: 'การปกครองส่วนท้องถิ่น',
    event_ids: ['ev-chiangmai'],
    created_at: daysFromSeed(-18),
    updated_at: daysFromSeed(-5),
    notified_at: daysFromSeed(-5),
  },
  {
    id: 'tp-education',
    title: 'รัฐควรรับรองสิทธิการศึกษาฟรีถึงระดับใด',
    category: 'การศึกษา',
    event_ids: ['ev-chiangmai'],
    created_at: daysFromSeed(-16),
    updated_at: daysFromSeed(-8),
    notified_at: daysFromSeed(-8),
  },
  {
    id: 'tp-unspecified',
    title: 'ข้อเสนอที่ยังไม่ได้จัดหมวดหมู่',
    category: 'ไม่ระบุ',
    event_ids: ['ev-chiangmai'],
    created_at: daysFromSeed(-14),
    updated_at: daysFromSeed(-14),
    notified_at: daysFromSeed(-14),
  },
  {
    // Newest topic: shows up first under the "latest" sort.
    id: 'tp-ssr',
    title: 'สสร. ควรมาจากการเลือกตั้งทั้งหมดหรือไม่',
    category: 'สสร.',
    event_ids: ['ev-chiangmai'],
    created_at: daysFromSeed(-1),
    updated_at: daysFromSeed(-1),
    notified_at: daysFromSeed(-1),
  },
];

interface SeedComment {
  id: string;
  ref_id?: string;
  topic: string;
  /** Ancestor chain, root first. The last entry is the direct parent. */
  parents: string[];
  view: CommentView;
  reason: string;
  ageInDays: number;
  /** Defaults to the topic's first event. Set it for cross-event replies or joined comments. */
  eventIds?: string[];
}

/**
 * Covers: all three comment views, nesting up to level 3, replies that disagree
 * with their parent, and legacy comments that predate `ref_id`.
 */
const seedComments: SeedComment[] = [
  {
    id: 'cm-rights-1',
    ref_id: 'SHEET-C001',
    topic: 'tp-rights',
    parents: [],
    view: CommentView.AGREE,
    reason: 'เสรีภาพในการแสดงออกควรได้รับการรับรองไว้ในหมวดสิทธิเสรีภาพชัดเจน',
    ageInDays: -25,
  },
  {
    id: 'cm-rights-1-1',
    topic: 'tp-rights',
    parents: ['cm-rights-1'],
    view: CommentView.PARTIAL_AGREE,
    reason: 'เห็นด้วย แต่ควรมีขอบเขตเรื่องการใส่ร้ายและข้อมูลเท็จ',
    ageInDays: -24,
  },
  {
    id: 'cm-rights-1-1-1',
    topic: 'tp-rights',
    parents: ['cm-rights-1', 'cm-rights-1-1'],
    view: CommentView.DISAGREE,
    reason: 'การจำกัดขอบเขตอาจถูกใช้เป็นเครื่องมือปิดปากผู้เห็นต่าง',
    ageInDays: -23,
  },
  {
    id: 'cm-rights-1-2',
    topic: 'tp-rights',
    parents: ['cm-rights-1'],
    view: CommentView.AGREE,
    reason: 'ควรระบุให้ครอบคลุมการแสดงออกทางศิลปะด้วย',
    ageInDays: -22,
  },
  {
    id: 'cm-rights-2',
    topic: 'tp-rights',
    parents: [],
    view: CommentView.DISAGREE,
    reason: 'ควรเขียนไว้ในกฎหมายลูกมากกว่าเขียนในรัฐธรรมนูญ',
    ageInDays: -20,
  },
  // Most-commented topic: five root comments.
  {
    id: 'cm-parliament-1',
    topic: 'tp-parliament',
    parents: [],
    view: CommentView.AGREE,
    reason: 'สมาชิกวุฒิสภาควรมาจากการเลือกตั้งโดยตรงทั้งหมด',
    ageInDays: -26,
  },
  {
    id: 'cm-parliament-2',
    topic: 'tp-parliament',
    parents: [],
    view: CommentView.PARTIAL_AGREE,
    reason: 'เลือกตั้งบางส่วน และให้มีตัวแทนวิชาชีพบางส่วน',
    ageInDays: -25,
  },
  {
    id: 'cm-parliament-3',
    topic: 'tp-parliament',
    parents: [],
    view: CommentView.DISAGREE,
    reason: 'ควรยกเลิกวุฒิสภาและใช้สภาเดี่ยว',
    ageInDays: -24,
  },
  {
    id: 'cm-parliament-4',
    topic: 'tp-parliament',
    parents: [],
    view: CommentView.AGREE,
    reason: 'ต้องมีวาระจำกัดและห้ามดำรงตำแหน่งติดต่อกัน',
    ageInDays: -23,
  },
  {
    id: 'cm-parliament-5',
    topic: 'tp-parliament',
    parents: [],
    view: CommentView.PARTIAL_AGREE,
    reason: 'ควรลดอำนาจในการเห็นชอบองค์กรอิสระ',
    ageInDays: -22,
  },
  {
    id: 'cm-parliament-3-1',
    topic: 'tp-parliament',
    parents: ['cm-parliament-3'],
    view: CommentView.DISAGREE,
    reason: 'สภาเดี่ยวอาจขาดกลไกกลั่นกรองกฎหมาย',
    ageInDays: -21,
  },
  {
    // Comment from an event the topic is not explicitly linked to: makes
    // tp-parliament a two-event topic that ev-online cannot leave or delete.
    id: 'cm-parliament-6',
    topic: 'tp-parliament',
    parents: [],
    view: CommentView.AGREE,
    eventIds: ['ev-online'],
    reason: 'ควรเปิดให้ประชาชนเสนอชื่อผู้สมัครวุฒิสภาได้ผ่านช่องทางออนไลน์',
    ageInDays: -19,
  },
  {
    // Cross-event reply: ev-online is linked to cm-parliament-3 through it and
    // cannot leave that comment while it exists.
    id: 'cm-parliament-3-2',
    topic: 'tp-parliament',
    parents: ['cm-parliament-3'],
    view: CommentView.PARTIAL_AGREE,
    eventIds: ['ev-online'],
    reason: 'สภาเดี่ยวต้องมาพร้อมกลไกตรวจสอบจากภาคประชาชน',
    ageInDays: -18,
  },
  {
    // Joined by a second event: ev-online can leave it, nobody can edit or delete it.
    id: 'cm-parliament-7',
    topic: 'tp-parliament',
    parents: [],
    view: CommentView.DISAGREE,
    eventIds: ['ev-bangkok', 'ev-online'],
    reason: 'ควรให้ประชาชนลงประชามติรับรองรายชื่อสมาชิกวุฒิสภา',
    ageInDays: -17,
  },
  {
    // Legacy comment: no ref_id, mirrors documents created before the field.
    id: 'cm-local-1',
    topic: 'tp-local',
    parents: [],
    view: CommentView.AGREE,
    reason: 'ท้องถิ่นควรจัดเก็บและใช้ภาษีของตัวเองได้ตามสัดส่วนที่ชัดเจน',
    ageInDays: -17,
  },
  {
    id: 'cm-local-1-1',
    ref_id: 'SHEET-C002',
    topic: 'tp-local',
    parents: ['cm-local-1'],
    view: CommentView.PARTIAL_AGREE,
    reason: 'เห็นด้วย แต่ต้องมีกลไกเกลี่ยรายได้ระหว่างท้องถิ่นรวยและจน',
    ageInDays: -16,
  },
  {
    id: 'cm-education-1',
    topic: 'tp-education',
    parents: [],
    view: CommentView.AGREE,
    reason: 'ควรรับรองการศึกษาฟรีถึงระดับปริญญาตรี',
    ageInDays: -15,
  },
  {
    id: 'cm-environment-1',
    topic: 'tp-environment',
    parents: [],
    view: CommentView.AGREE,
    reason: 'สิทธิในอากาศสะอาดควรเป็นสิทธิขั้นพื้นฐาน',
    ageInDays: -12,
  },
  {
    id: 'cm-welfare-1',
    topic: 'tp-welfare',
    parents: [],
    view: CommentView.PARTIAL_AGREE,
    reason: 'ควรเริ่มจากสวัสดิการเด็กและผู้สูงอายุก่อน',
    ageInDays: -10,
  },
  {
    id: 'cm-other-1',
    topic: 'tp-other',
    parents: [],
    view: CommentView.DISAGREE,
    reason: 'ไม่ควรมีบทเฉพาะกาลที่ยืดอายุองค์กรที่ไม่ได้มาจากการเลือกตั้ง',
    ageInDays: -9,
  },
  {
    id: 'cm-unspecified-1',
    topic: 'tp-unspecified',
    parents: [],
    view: CommentView.AGREE,
    reason: 'อยากให้มีช่องทางให้ประชาชนเสนอแก้ไขรัฐธรรมนูญได้โดยตรง',
    ageInDays: -8,
  },
  {
    id: 'cm-ssr-1',
    topic: 'tp-ssr',
    parents: [],
    view: CommentView.AGREE,
    reason: 'สสร. ต้องมาจากการเลือกตั้งทั้งหมดเพื่อความชอบธรรม',
    ageInDays: 0,
  },
];

const comments: CommentDB[] = seedComments.map(c => ({
  id: c.id,
  ...(c.ref_id ? { ref_id: c.ref_id } : {}),
  comment_view: c.view,
  reason: c.reason,
  parent_comment_ids: c.parents,
  parent_topic_id: c.topic,
  event_ids: c.eventIds ?? [topics.find(t => t.id === c.topic)!.event_ids[0]],
  created_at: daysFromSeed(c.ageInDays),
  updated_at: daysFromSeed(c.ageInDays),
  notified_at: daysFromSeed(c.ageInDays),
}));

/** Covers permanent, still-valid and expired writer tokens. */
const writers: Writer[] = [
  {
    id: 'writer-permanent-bangkok',
    event_id: 'ev-bangkok',
    is_permanent: true,
    created_at: daysFromSeed(-30),
  },
  {
    id: 'writer-permanent-online',
    event_id: 'ev-online',
    is_permanent: true,
    created_at: daysFromSeed(-5),
  },
  {
    id: 'writer-active-chiangmai',
    event_id: 'ev-chiangmai',
    created_at: daysFromSeed(-1),
    expired_at: daysFromSeed(3650),
  },
  {
    id: 'writer-expired-chiangmai',
    event_id: 'ev-chiangmai',
    created_at: daysFromSeed(-20),
    expired_at: daysFromSeed(-13),
  },
];

const emulatorFetch = async (url: string) => {
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`${url} responded ${res.status}`);
  }
};

const clearEmulators = async () => {
  const { projectId } = EMULATOR_FIREBASE_CONFIG;
  await emulatorFetch(
    `http://${EMULATOR_HOST}:${FIRESTORE_EMULATOR_PORT}/emulator/v1/projects/${projectId}/databases/(default)/documents`
  );
  await emulatorFetch(
    `http://${EMULATOR_HOST}:${AUTH_EMULATOR_PORT}/emulator/v1/projects/${projectId}/accounts`
  );
};

const main = async () => {
  try {
    await clearEmulators();
  } catch (err) {
    console.error(
      '[seed] Could not reach the emulators. Start them with `pnpm emulators` first.'
    );
    throw err;
  }

  const { db, auth } = initDB();

  // Writers can only be created by a signed-in user (see firestore.rules).
  // clearEmulators() wiped the auth accounts, so this always creates a fresh one.
  await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);

  const batch = writeBatch(db);
  events.forEach(({ id, ...data }) => batch.set(doc(db, 'events', id), data));
  topics.forEach(({ id, ...data }) => batch.set(doc(db, 'topics', id), data));
  comments.forEach(({ id, ...data }) =>
    batch.set(doc(db, 'comments', id), data)
  );
  writers.forEach(({ id, ...data }) => batch.set(doc(db, 'writers', id), data));
  await batch.commit();

  console.log(
    `[seed] ${events.length} events, ${topics.length} topics, ${comments.length} comments, ${writers.length} writers`
  );
  console.log(`[seed] admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  writers.forEach(w =>
    console.log(`[seed] writer token (${w.event_id}): ${w.id}`)
  );
};

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('[seed] Failed:', err);
    process.exit(1);
  });
