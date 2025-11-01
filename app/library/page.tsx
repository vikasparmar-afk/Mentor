'use client';

import { useEffect, useState } from 'react';
import { Book, PhilosophyCategory, BookStatus } from '@/types';
import { storage, initializeSampleData } from '@/lib/storage';
import BookCard from '@/components/BookCard';
import CategoryFilter from '@/components/CategoryFilter';

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PhilosophyCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || book.status === selectedStatus;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const categoryCounts = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-saffron-600 to-indigo-600 bg-clip-text text-transparent">
          Library
        </h1>
        <p className="text-gray-600">Explore your collection of philosophical texts</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
        />
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All Books' },
            { value: 'reading', label: 'Reading' },
            { value: 'completed', label: 'Completed' },
            { value: 'want-to-read', label: 'Want to Read' },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value as BookStatus | 'all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedStatus === status.value
                  ? 'bg-gradient-to-r from-saffron-500 to-indigo-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Philosophy</h3>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No books found</p>
          <p className="text-gray-400">Try adjusting your filters or add a new book to your library</p>
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 text-center text-sm text-gray-600">
        Showing {filteredBooks.length} of {books.length} books
      </div>
    </div>
  );
}
