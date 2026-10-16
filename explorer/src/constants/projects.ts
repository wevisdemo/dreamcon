import cdaSimulator from '../assets/projects/cda.webp';
import constitutionalCourt from '../assets/projects/con-court.webp';
import constitutionLab from '../assets/projects/conlab.webp';
import fillTheRightGaps from '../assets/projects/fill-right-gap.webp';
import reconstitution from '../assets/projects/recon.webp';

export const PROJECTS = [
  {
    name: 'Fill the Right Gaps',
    description:
      'สำรวจการเขียนเรื่องสิทธิเสรีภาพในรัฐธรรมนูญของ 161 ประเทศทั่วโลก ที่ยังไม่ปรากฎในรัฐธรรมนูญไทย เพื่อหาความเป็นไปได้ใหม่ ๆ',
    href: 'https://wevis.info/fill-right-gaps/',
    image: fillTheRightGaps,
  },
  {
    name: 'Reconstitution',
    description: 'เปรียบเทียบรัฐธรรมนูญแต่ละหมวดของประเทศไทย ตั้งแต่ฉบับแรกถึงปัจจุบัน',
    href: 'https://reconstitution.wevis.info/',
    image: reconstitution,
  },
  {
    name: 'CDA Simulator',
    description:
      'สำรวจโมเดลในการเลือกสภาร่างรัฐธรรมนูญ (สสร.) แบบต่าง ๆ พร้อมข้อดี-ข้อเสีย',
    href: 'https://wevis.info/cda-simulator',
    image: cdaSimulator,
  },
  {
    name: 'Constitution Lab',
    description:
      'ห้องเรียนซ้อมออกแบบรัฐธรรมนูญในประเด็นต่าง ๆ เช่น รัฐสภา องค์กรอิสระ ระบบเลือกตั้ง',
    href: 'https://conlab.wevis.info/',
    image: constitutionLab,
  },
  {
    name: 'The Constitutional Court',
    description:
      'ชำแหละคำวินิจฉัยศาลรัฐธรรมนูญไทย เพื่อหาคำตอบว่าศาลฯ ทำหน้าที่ตามค่านิยมของตัวเองมากน้อยแค่ไหน',
    href: 'https://wevis.info/con-court',
    image: constitutionalCourt,
  },
];
