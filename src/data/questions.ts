export interface InterviewQuestion {
  id: string;
  category: 'Personal' | 'Academic' | 'Critical' | 'Vision' | 'Fit';
  en: string;
  vi: string;
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: 'p1', category: 'Personal', en: 'Tell me about yourself — in a way your application does not already show.', vi: 'Hãy kể về bản thân — theo cách mà hồ sơ của bạn chưa thể hiện.' },
  { id: 'p2', category: 'Personal', en: 'What is something you used to believe, and no longer do?', vi: 'Điều gì bạn từng tin, nhưng giờ không còn tin nữa?' },
  { id: 'a1', category: 'Academic', en: 'Describe a problem you have spent a long time thinking about.', vi: 'Hãy mô tả một vấn đề bạn đã dành nhiều thời gian suy nghĩ.' },
  { id: 'a2', category: 'Academic', en: 'What is a question in your field that no one has answered well yet?', vi: 'Trong lĩnh vực bạn quan tâm, câu hỏi nào vẫn chưa ai trả lời thấu đáo?' },
  { id: 'c1', category: 'Critical', en: 'Describe a real failure — not a humble-brag — and what you did differently next time.', vi: 'Hãy mô tả một thất bại thật — không phải khoe khéo — và bạn đã làm khác đi thế nào lần sau.' },
  { id: 'c2', category: 'Critical', en: 'When was the last time you changed your mind about something that mattered?', vi: 'Lần gần nhất bạn thay đổi suy nghĩ về một điều quan trọng là khi nào?' },
  { id: 'v1', category: 'Vision', en: 'What would you like to be working on five years from now?', vi: 'Năm năm nữa bạn muốn đang làm điều gì?' },
  { id: 'v2', category: 'Vision', en: 'If you had one unhurried summer, what would you work on?', vi: 'Nếu có một mùa hè không vội, bạn sẽ làm gì?' },
  { id: 'f1', category: 'Fit', en: 'Why this school, and not the school next to it?', vi: 'Tại sao là trường này, mà không phải trường kế bên?' },
  { id: 'f2', category: 'Fit', en: 'Where on campus would someone most likely find you at 11pm on a Tuesday?', vi: 'Lúc 11 giờ đêm thứ Ba, ai đó có thể tìm thấy bạn ở đâu trong trường?' },
];
