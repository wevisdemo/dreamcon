import { collection, doc, runTransaction } from 'firebase/firestore';
import { AddOrEditEventPayload, CreateEventDBPayload } from '../types/event';
import { initDB } from './firestore';

const { db } = initDB();

const events: AddOrEditEventPayload[] = [
  {
    display_name: 'Dream Con x The Active',
    avatar_url: 'https://example.com/avatar1.png',
    title_en: 'Dream Con x The Active',
    title_th: 'ร้อยเหตุผล ร่วมสนทนา ร่างรัฐธรรมนูญฉบับประชาชน',
    description: '',
    location: '-',
    date: '2024-03-12',
    target_group:
      'ประชาชนที่สนใจประเด็นการแก้ไขรัฐธรรมนูญ สื่อมวลชน นักวิชาการ สมาชิกรัฐสภา กลุ่มเคลื่อนไหวเรื่องรัฐธรรมนูญ',
    participants: 40,
    news_link: '-',
  },
  {
    display_name: 'TIJ Youth Dialogue',
    avatar_url: 'https://example.com/avatar1.png',
    title_en: 'Youth Dialogue on Dream Constitution',
    title_th: '-',
    description: '',
    location: '-',
    date: '2024-08-02',
    target_group: 'เยาวชนอายุ 15-25 ปี ทั้งในกรุงเทพฯ และต่างจังหวัด',
    participants: 50,
    news_link: '-',
  },
];

const createEvent = async (payload: AddOrEditEventPayload) => {
  // This will not validate anything, so please be caution when using this function.
  try {
    const eventsCollection = collection(db, 'events');
    const timeNow = new Date();
    const eventDBPayload: CreateEventDBPayload = {
      display_name: payload.display_name,
      avatar_url: payload.avatar_url,
      title_en: payload.title_en,
      title_th: payload.title_th,
      description: payload.description,
      location: payload.location,
      date: payload.date,
      target_group: payload.target_group,
      participants: payload.participants || 0,
      news_link: payload.news_link,
      created_at: timeNow,
      updated_at: timeNow,
    };

    await runTransaction(db, async transaction => {
      const docRef = doc(eventsCollection);
      transaction.set(docRef, eventDBPayload);

      console.log('Document written with ID: ', docRef.id);
    });
  } catch (err) {
    console.error('Error adding document: ', err);
  }
};

export const migrateEvent01 = async () => {
  for (const event of events) {
    await createEvent(event);
  }
};
// console.log('firebaseConfig', process.env.VITE_FIREBASE_CONFIG);

migrateEvent01()
  .then(() => {
    console.log('Migration completed successfully.');
  })
  .catch(err => {
    console.error('Migration failed:', err);
  });
