import { Book, Stats } from '@/types';
import { storage } from './storage';

export const calculateStats = (books: Book[]): Stats => {
  const totalBooks = books.length;
  const booksCompleted = books.filter(b => b.status === 'completed').length;
  const booksReading = books.filter(b => b.status === 'reading').length;
  
  const totalPagesRead = books.reduce((sum, book) => {
    if (book.status === 'completed') {
      return sum + book.totalPages;
    } else if (book.status === 'reading') {
      return sum + book.currentPage;
    }
    return sum;
  }, 0);

  const ratedBooks = books.filter(b => b.rating > 0);
  const averageRating = ratedBooks.length > 0
    ? ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length
    : 0;

  const readingStreak = storage.getStreak();

  return {
    totalBooks,
    booksCompleted,
    booksReading,
    totalPagesRead,
    averageRating,
    readingStreak,
  };
};

export const getProgressPercentage = (currentPage: number, totalPages: number): number => {
  if (totalPages === 0) return 0;
  return Math.round((currentPage / totalPages) * 100);
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Not started';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Vedanta': 'bg-orange-500',
    'Yoga': 'bg-indigo-500',
    'Samkhya': 'bg-purple-500',
    'Buddhism': 'bg-amber-600',
    'Jainism': 'bg-green-600',
    'Nyaya': 'bg-blue-600',
    'Vaisheshika': 'bg-teal-600',
    'Mimamsa': 'bg-rose-600',
    'Other': 'bg-gray-600',
  };
  return colors[category] || colors['Other'];
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'want-to-read': 'bg-gray-100 text-gray-800',
    'reading': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
  };
  return colors[status] || colors['want-to-read'];
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'want-to-read': 'Want to Read',
    'reading': 'Reading',
    'completed': 'Completed',
  };
  return labels[status] || status;
};
