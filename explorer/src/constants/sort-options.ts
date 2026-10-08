import { commentViews, type CommentView } from './comment-views';

export const sortOptions: {
  value: string;
  label: string;
  views: readonly CommentView[];
}[] = [
  { value: 'comments', label: 'จำนวนความคิดเห็น', views: commentViews },
  { value: 'agree', label: 'จำนวนเห็นด้วย', views: ['เห็นด้วย'] },
  {
    value: 'disagree',
    label: 'จำนวนเห็นด้วยบางส่วน และไม่เห็นด้วย',
    views: ['เห็นด้วยบางส่วน', 'ไม่เห็นด้วย'],
  },
];

export const relevanceSortOption = {
  value: 'relevance',
  label: 'ความใกล้เคียงคำค้น',
};

export const phraseSortOption = {
  value: 'phrase',
  label: 'ความเกี่ยวข้องกับประเด็นที่เลือก',
};
