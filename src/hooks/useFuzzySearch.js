import { useState, useMemo } from 'react';

/**
 * Custom hook for fuzzy searching through items
 * Matches items where all characters of the search term appear in order
 * 
 * @param {Array} items - Array of items to search
 * @param {Function} getSearchText - Function to extract searchable text from item
 * @returns {Object} { searchTerm, setSearchTerm, results }
 */
export const useFuzzySearch = (items, getSearchText) => {
  const [searchTerm, setSearchTerm] = useState('');

  const results = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }

    const query = searchTerm.toLowerCase();
    
    return items.filter(item => {
      const text = getSearchText(item).toLowerCase();
      let queryIdx = 0;
      
      // Check if all characters in query appear in text (in order)
      for (let i = 0; i < text.length && queryIdx < query.length; i++) {
        if (text[i] === query[queryIdx]) {
          queryIdx++;
        }
      }
      
      return queryIdx === query.length;
    });
  }, [items, searchTerm, getSearchText]);

  return { searchTerm, setSearchTerm, results };
};
