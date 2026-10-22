import fnfLogo from '../assets/partner-fnf.svg';
import handLogo from '../assets/partner-hand.png';
import tijLogo from '../assets/partner-tij.svg';
import wevisLogo from '../assets/partner-wevis.svg';

export const ORGANIZERS = [
  {
    name: 'มูลนิธิฟรีดริช เนามัน ประเทศไทย (FNF Thailand)',
    logo: fnfLogo,
    width: 130,
    height: 36,
  },
  { name: 'วีวิซ เดโม (WeVis)', logo: wevisLogo, width: 100, height: 30 },
  {
    name: 'สถาบันเพื่อการยุติธรรมแห่งประเทศไทย (TIJ)',
    logo: tijLogo,
    width: 82,
    height: 41,
  },
  { name: 'HAND Social Enterprise', logo: handLogo, width: 98, height: 43 },
];

export const ORGANIZERS_SUMMARY = `โครงการ Dream Con เกิดขึ้นจากความร่วมมือขององค์กรต่าง ๆ ได้แก่ ${ORGANIZERS.slice(
  0,
  -1
)
  .map(({ name }) => name)
  .join(' ')} และ ${ORGANIZERS.at(-1)?.name}`;
