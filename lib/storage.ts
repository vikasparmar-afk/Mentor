import { Book, ReadingSession, ReadingStreak } from '@/types';

const BOOKS_KEY = 'sanskriti_books';
const SESSIONS_KEY = 'sanskriti_sessions';
const STREAK_KEY = 'sanskriti_streak';

export const storage = {
  // Books
  getBooks: (): Book[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(BOOKS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveBooks: (books: Book[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  },

  addBook: (book: Book): void => {
    const books = storage.getBooks();
    books.push(book);
    storage.saveBooks(books);
  },

  updateBook: (id: string, updates: Partial<Book>): void => {
    const books = storage.getBooks();
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...updates };
      storage.saveBooks(books);
    }
  },

  deleteBook: (id: string): void => {
    const books = storage.getBooks().filter(b => b.id !== id);
    storage.saveBooks(books);
  },

  getBook: (id: string): Book | undefined => {
    return storage.getBooks().find(b => b.id === id);
  },

  // Reading Sessions
  getSessions: (): ReadingSession[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSessions: (sessions: ReadingSession[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },

  addSession: (session: ReadingSession): void => {
    const sessions = storage.getSessions();
    sessions.push(session);
    storage.saveSessions(sessions);
  },

  getBookSessions: (bookId: string): ReadingSession[] => {
    return storage.getSessions().filter(s => s.bookId === bookId);
  },

  // Reading Streak
  getStreak: (): ReadingStreak => {
    if (typeof window === 'undefined') {
      return { currentStreak: 0, longestStreak: 0, lastReadDate: null };
    }
    const data = localStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : { currentStreak: 0, longestStreak: 0, lastReadDate: null };
  },

  saveStreak: (streak: ReadingStreak): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  },

  updateStreak: (): void => {
    const streak = storage.getStreak();
    const today = new Date().toISOString().split('T')[0];
    
    if (streak.lastReadDate === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastReadDate === yesterdayStr) {
      streak.currentStreak += 1;
    } else if (streak.lastReadDate !== today) {
      streak.currentStreak = 1;
    }

    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    streak.lastReadDate = today;
    storage.saveStreak(streak);
  },
};

// Initialize with sample data if empty
export const initializeSampleData = (): void => {
  if (storage.getBooks().length === 0) {
    const sampleBooks: Book[] = [
      {
        id: '1',
        title: 'Bhagavad Gita',
        author: 'Vyasa',
        category: 'Vedanta',
        totalPages: 700,
        currentPage: 150,
        rating: 5,
        status: 'reading',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: null,
        notes: 'The eternal dialogue between Krishna and Arjuna. Profound insights on dharma and karma.',
        coverColor: '#f97316',
        dateAdded: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        title: 'Yoga Sutras of Patanjali',
        author: 'Patanjali',
        category: 'Yoga',
        totalPages: 195,
        currentPage: 195,
        rating: 5,
        status: 'completed',
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Complete guide to the eight limbs of yoga. Transformative practice.',
        coverColor: '#6366f1',
        dateAdded: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        title: 'The Upanishads',
        author: 'Various Sages',
        category: 'Vedanta',
        totalPages: 500,
        currentPage: 0,
        rating: 0,
        status: 'want-to-read',
        startDate: null,
        endDate: null,
        notes: '',
        coverColor: '#ea580c',
        dateAdded: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'The Dhammapada',
        author: 'Buddha',
        category: 'Buddhism',
        totalPages: 423,
        currentPage: 200,
        rating: 5,
        status: 'reading',
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: null,
        notes: 'Collection of sayings of the Buddha. Beautiful verses on mindfulness.',
        coverColor: '#c2410c',
        dateAdded: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    storage.saveBooks(sampleBooks);
  }
};
