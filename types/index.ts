export type PhilosophyCategory = 
  | 'Vedanta'
  | 'Yoga'
  | 'Samkhya'
  | 'Buddhism'
  | 'Jainism'
  | 'Nyaya'
  | 'Vaisheshika'
  | 'Mimamsa'
  | 'Other';

export type BookStatus = 'want-to-read' | 'reading' | 'completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: PhilosophyCategory;
  totalPages: number;
  currentPage: number;
  rating: number;
  status: BookStatus;
  startDate: string | null;
  endDate: string | null;
  notes: string;
  coverColor: string;
  dateAdded: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  date: string;
  pagesRead: number;
  duration: number;
  notes: string;
}

export interface ReadingStreak {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
}

export interface Stats {
  totalBooks: number;
  booksCompleted: number;
  booksReading: number;
  totalPagesRead: number;
  averageRating: number;
  readingStreak: ReadingStreak;
}
