export const commentViews = ['เห็นด้วย', 'เห็นด้วยบางส่วน', 'ไม่เห็นด้วย'] as const;

export type CommentView = (typeof commentViews)[number];
