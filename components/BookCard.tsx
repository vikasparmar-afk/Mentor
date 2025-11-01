'use client';

import Link from 'next/link';
import { Book } from '@/types';
import { getProgressPercentage, getCategoryColor, getStatusLabel, getStatusColor } from '@/lib/utils';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const progress = getProgressPercentage(book.currentPage, book.totalPages);

  return (
    <Link href={`/book/${book.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 cursor-pointer">
        <div 
          className="h-32 flex items-center justify-center text-white font-bold text-xl p-4 text-center"
          style={{ backgroundColor: book.coverColor }}
        >
          {book.title}
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-1 rounded-full text-white ${getCategoryColor(book.category)}`}>
              {book.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(book.status)}`}>
              {getStatusLabel(book.status)}
            </span>
          </div>

          {book.status !== 'want-to-read' && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-saffron-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {book.currentPage} / {book.totalPages} pages
              </p>
            </div>
          )}

          {book.rating > 0 && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < book.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
