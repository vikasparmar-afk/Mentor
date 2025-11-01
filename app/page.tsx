'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Book } from '@/types';
import { storage, initializeSampleData } from '@/lib/storage';
import { calculateStats } from '@/lib/utils';
import BookCard from '@/components/BookCard';
import StatCard from '@/components/StatCard';

export default function Dashboard() {
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
  const recentBooks = books
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 4);
  const currentlyReading = books.filter(b => b.status === 'reading');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-saffron-600 via-orange-500 to-indigo-600 bg-clip-text text-transparent">
          Welcome to Sanskriti
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your journey through the profound depths of Indian philosophy
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          subtitle="In your library"
          icon="📚"
          gradient="from-saffron-500 to-orange-600"
        />
        <StatCard
          title="Books Completed"
          value={stats.booksCompleted}
          subtitle="Finished reading"
          icon="✓"
          gradient="from-green-500 to-emerald-600"
        />
        <StatCard
          title="Currently Reading"
          value={stats.booksReading}
          subtitle="In progress"
          icon="📖"
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Reading Streak"
          value={`${stats.readingStreak.currentStreak} days`}
          subtitle={`Longest: ${stats.readingStreak.longestStreak} days`}
          icon="🔥"
          gradient="from-orange-500 to-red-600"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Pages Read</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-saffron-600 to-indigo-600 bg-clip-text text-transparent">
            {stats.totalPagesRead.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Pages of wisdom absorbed</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Rating</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              {stats.averageRating.toFixed(1)}
            </p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xl ${i < Math.round(stats.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Your overall satisfaction</p>
        </div>
      </div>

      {/* Currently Reading */}
      {currentlyReading.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Currently Reading</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentlyReading.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Books */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Additions</h2>
          <Link 
            href="/library"
            className="text-saffron-600 hover:text-saffron-700 font-medium text-sm"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-saffron-500 to-indigo-500 rounded-lg shadow-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Begin Your Journey</h2>
        <p className="mb-6 text-white/90">
          Add a new philosophical text to your library and start exploring ancient wisdom
        </p>
        <Link
          href="/add"
          className="inline-block bg-white text-saffron-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
        >
          Add New Book
        </Link>
      </div>
    </div>
  );
}
