'use client';

import { PhilosophyCategory } from '@/types';
import { getCategoryColor } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: PhilosophyCategory | 'All';
  onSelectCategory: (category: PhilosophyCategory | 'All') => void;
  categoryCounts: Record<string, number>;
}

const categories: (PhilosophyCategory | 'All')[] = [
  'All',
  'Vedanta',
  'Yoga',
  'Samkhya',
  'Buddhism',
  'Jainism',
  'Nyaya',
  'Vaisheshika',
  'Mimamsa',
  'Other',
];

export default function CategoryFilter({ 
  selectedCategory, 
  onSelectCategory,
  categoryCounts 
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const count = category === 'All' 
          ? Object.values(categoryCounts).reduce((sum, c) => sum + c, 0)
          : categoryCounts[category] || 0;
        
        const isSelected = selectedCategory === category;
        const colorClass = category === 'All' ? 'bg-gray-600' : getCategoryColor(category);

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isSelected
                ? `${colorClass} text-white shadow-lg scale-105`
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-md'
            }`}
          >
            {category} ({count})
          </button>
        );
      })}
    </div>
  );
}
