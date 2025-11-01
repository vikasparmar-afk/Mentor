'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Book } from '@/types';
import { storage } from '@/lib/storage';
import { getProgressPercentage, getCategoryColor, formatDate, getStatusLabel } from '@/lib/utils';
import ProgressBar from '@/components/ProgressBar';

export default function BookDetails() {
  const router = useRouter();
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    currentPage: '',
    rating: '',
    notes: '',
    status: 'reading' as Book['status'],
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = params.id as string;
    const foundBook = storage.getBook(id);
    if (foundBook) {
      setBook(foundBook);
      setEditData({
        currentPage: foundBook.currentPage.toString(),
        rating: foundBook.rating.toString(),
        notes: foundBook.notes,
        status: foundBook.status,
      });
    }
  }, [params.id]);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Book not found</p>
          <button
            onClick={() => router.push('/library')}
            className="text-saffron-600 hover:text-saffron-700 font-medium"
          >
            ← Back to Library
          </button>
        </div>
      </div>
    );
  }

  const handleUpdate = () => {
    const updates: Partial<Book> = {
      currentPage: parseInt(editData.currentPage),
      rating: parseInt(editData.rating),
      notes: editData.notes,
      status: editData.status,
    };

    if (editData.status === 'reading' && book.status !== 'reading') {
      updates.startDate = new Date().toISOString();
    }

    if (editData.status === 'completed' && book.status !== 'completed') {
      updates.endDate = new Date().toISOString();
      updates.currentPage = book.totalPages;
      storage.updateStreak();
    }

    storage.updateBook(book.id, updates);
    const updatedBook = storage.getBook(book.id);
    if (updatedBook) {
      setBook(updatedBook);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this book?')) {
      storage.deleteBook(book.id);
      router.push('/library');
    }
  };

  const progress = getProgressPercentage(book.currentPage, book.totalPages);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="text-saffron-600 hover:text-saffron-700 font-medium mb-6 inline-flex items-center"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* Book Header */}
        <div
          className="h-48 flex items-center justify-center text-white p-8"
          style={{ backgroundColor: book.coverColor }}
        >
          <h1 className="text-4xl font-bold text-center">{book.title}</h1>
        </div>

        <div className="p-8">
          {/* Book Info */}
          <div className="mb-6">
            <p className="text-xl text-gray-700 mb-2">by {book.author}</p>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm text-white ${getCategoryColor(book.category)}`}>
                {book.category}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                {getStatusLabel(book.status)}
              </span>
            </div>
          </div>

          {/* Progress Section */}
          {book.status !== 'want-to-read' && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Reading Progress</h2>
              <ProgressBar
                current={book.currentPage}
                total={book.totalPages}
                label="Pages Read"
              />
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Date Added</p>
              <p className="font-semibold text-gray-800">{formatDate(book.dateAdded)}</p>
            </div>
            {book.startDate && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Started Reading</p>
                <p className="font-semibold text-gray-800">{formatDate(book.startDate)}</p>
              </div>
            )}
            {book.endDate && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="font-semibold text-gray-800">{formatDate(book.endDate)}</p>
              </div>
            )}
          </div>

          {/* Rating */}
          {!isEditing && book.rating > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Rating</h2>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-3xl ${i < book.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {!isEditing && book.notes && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Notes</h2>
              <div className="bg-amber-50 border-l-4 border-saffron-500 p-4 rounded">
                <p className="text-gray-700 whitespace-pre-wrap">{book.notes}</p>
              </div>
            </div>
          )}

          {/* Edit Form */}
          {isEditing && (
            <div className="mb-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reading Status
                </label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as Book['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="want-to-read">Want to Read</option>
                  <option value="reading">Currently Reading</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {editData.status !== 'want-to-read' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Page
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={book.totalPages}
                    value={editData.currentPage}
                    onChange={(e) => setEditData({ ...editData, currentPage: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={editData.rating}
                  onChange={(e) => setEditData({ ...editData, rating: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={6}
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  placeholder="Your thoughts and insights..."
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-gradient-to-r from-saffron-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Update Progress
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-gradient-to-r from-saffron-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
