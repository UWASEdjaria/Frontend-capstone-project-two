"use client";

import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  _count?: { posts: number };
}

interface CategoryFilterProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

export default function CategoryFilter({ onCategorySelect, selectedCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const displayedCategories = showAll ? categories : categories.slice(0, 12);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-6 shadow-lg">
      <h3 className="text-lg font-semibold text-black mb-3">Categories</h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => onCategorySelect(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Categories
        </button>
        
        {displayedCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.name)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.name
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
            {category._count && (
              <span className="ml-1 text-xs opacity-75">
                ({category._count.posts})
              </span>
            )}
          </button>
        ))}
      </div>

      {categories.length > 12 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showAll ? 'Show Less' : `Show All ${categories.length} Categories`}
        </button>
      )}
    </div>
  );
}