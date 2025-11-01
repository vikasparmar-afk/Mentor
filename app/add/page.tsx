'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhilosophyCategory, BookStatus } from '@/types';
import { storage } from '@/lib/storage';
import { generateId } from '@/lib/utils';

export default function AddBook() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Vedanta' as PhilosophyCategory,
    totalPages: '',
    currentPage: '0',
    rating: '0',
    status: 'want-to-read' as BookStatus,
    notes: '',
    coverColor: '#f97316',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBook = {
      id: generateId(),
      title: formData.title,
      author: formData.author,
      category: formData.category,
      totalPages: parseInt(formData.totalPages),
      currentPage: parseInt(formData.currentPage),
      rating: parseInt(formData.rating),
      status: formData.status,
      startDate: formData.status === 'reading' ? new Date().toISOString() : null,
      endDate: formData.status === 'completed' ? new Date().toISOString() : null,
      notes: formData.notes,
      coverColor: formData.coverColor,
      dateAdded: new Date().toISOString(),
    };

    storage.addBook(newBook);
    router.push('/library');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const categories: PhilosophyCategory[] = [
    'Vedanta', 'Yoga', 'Samkhya', 'Buddhism', 'Jainism', 
    'Nyaya', 'Vaisheshika', 'Mimamsa', 'Other'
  ];

  const coverColors = [
    { name: 'Saffron', value: '#f97316' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Amber', value: '#f59e0b' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-saffron-600 to-indigo-600 bg-clip-text text-transparent">
          Add New Book
        </h1>
        <p className="text-gray-600">Add a philosophical text to your library</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
            placeholder="e.g., Bhagavad Gita"
          />
        </div>

        {/* Author */}
        <div className="mb-6">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            required
            value={formData.author}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
            placeholder="e.g., Vyasa"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Philosophy Category *
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Total Pages */}
        <div className="mb-6">
          <label htmlFor="totalPages" className="block text-sm font-medium text-gray-700 mb-2">
            Total Pages *
          </label>
          <input
            type="number"
            id="totalPages"
            name="totalPages"
            required
            min="1"
            value={formData.totalPages}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
            placeholder="e.g., 700"
          />
        </div>

        {/* Status */}
        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Reading Status *
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
          >
            <option value="want-to-read">Want to Read</option>
            <option value="reading">Currently Reading</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Current Page (if reading or completed) */}
        {(formData.status === 'reading' || formData.status === 'completed') && (
          <div className="mb-6">
            <label htmlFor="currentPage" className="block text-sm font-medium text-gray-700 mb-2">
              Current Page
            </label>
            <input
              type="number"
              id="currentPage"
              name="currentPage"
              min="0"
              max={formData.totalPages}
              value={formData.currentPage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>
        )}

        {/* Rating (if completed) */}
        {formData.status === 'completed' && (
          <div className="mb-6">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
              Rating (0-5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              min="0"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>
        )}

        {/* Cover Color */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Color
          </label>
          <div className="flex flex-wrap gap-3">
            {coverColors.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, coverColor: color.value }))}
                className={`w-12 h-12 rounded-lg transition-all duration-200 ${
                  formData.coverColor === color.value 
                    ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' 
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
            placeholder="Your thoughts and insights..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-saffron-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Add Book
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
