'use client';

import { useEffect, useState } from 'react';
import { Book, PhilosophyCategory } from '@/types';
import { storage, initializeSampleData } from '@/lib/storage';
import { calculateStats } from '@/lib/utils';
import StatCard from '@/components/StatCard';

export default function Analytics() {
  const [books, setBooks] = useState<Book[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeSampleData();
    setBooks(storage.getBooks());
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const stats = calculateStats(books);

  const categoryBreakdown = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<PhilosophyCategory, number>);

  const statusBreakdown = {
    'Want to Read': books.filter(b => b.status === 'want-to-read').length,
    'Reading': books.filter(b => b.status === 'reading').length,
    'Completed': books.filter(b => b.status === 'completed').length,
  };

  const topRatedBooks = books
    .filter(b => b.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const recentlyCompleted = books
    .filter(b => b.status === 'completed' && b.endDate)
    .sort((a, b) => new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-saffron-600 to-indigo-600 bg-clip-text text-transparent">
          Analytics
        </h1>
        <p className="text-gray-600">Insights into your philosophical journey</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          subtitle="In your library"
          gradient="from-saffron-500 to-orange-600"
        />
        <StatCard
          title="Completed"
          value={stats.booksCompleted}
          subtitle={`${Math.round((stats.booksCompleted / stats.totalBooks) * 100)}% completion rate`}
          gradient="from-green-500 to-emerald-600"
        />
        <StatCard
          title="Pages Read"
          value={stats.totalPagesRead.toLocaleString()}
          subtitle="Total wisdom absorbed"
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Avg Rating"
          value={stats.averageRating.toFixed(1)}
          subtitle="Out of 5 stars"
          gradient="from-yellow-500 to-orange-600"
        />
      </div>

      {/* Reading Streak */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reading Streak</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Current Streak</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              {stats.readingStreak.currentStreak} days 🔥
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Longest Streak</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              {stats.readingStreak.longestStreak} days 🏆
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Books by Philosophy</h2>
        <div className="space-y-4">
          {Object.entries(categoryBreakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => {
              const percentage = Math.round((count / stats.totalBooks) * 100);
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{category}</span>
                    <span className="text-gray-600">{count} books ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-saffron-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reading Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Object.entries(statusBreakdown).map(([status, count]) => {
            const percentage = stats.totalBooks > 0 ? Math.round((count / stats.totalBooks) * 100) : 0;
            return (
              <div key={status} className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-saffron-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {count}
                </p>
                <p className="text-sm font-medium text-gray-700">{status}</p>
                <p className="text-xs text-gray-500">{percentage}% of library</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Rated Books */}
      {topRatedBooks.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Rated Books</h2>
          <div className="space-y-3">
            {topRatedBooks.map((book, index) => (
              <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < book.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Completed */}
      {recentlyCompleted.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recently Completed</h2>
          <div className="space-y-3">
            {recentlyCompleted.map((book) => (
              <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">{book.title}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">Completed</p>
                  <p className="text-xs text-gray-500">
                    {new Date(book.endDate!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
