import { useState, useRef, useEffect } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

const popularSearches = [
  'wireless earbuds',
  'smart watch',
  'running shoes',
  'laptop',
  'smartphone',
  'headphones',
  'gaming console',
  'camera',
  'dress',
  'shoes',
  'noodles',
  'solar',
  'inverter',
  'perfume',
  'cologne',
];

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps = {}) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getCurrencySymbol, convertPrice } = useCurrency();
  
  const aiSuggestions = [
    `cheap red sneakers under ${getCurrencySymbol()}${convertPrice(50).toFixed(0)}`,
    'best rated wireless headphones',
    'eco-friendly water bottles',
    'top gaming laptops 2025',
  ];

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    // Call the onSearch callback if provided
    if (onSearch) {
      onSearch(searchQuery);
    }
    
    // Scroll to trending products section
    const trendingSection = document.getElementById('trending-section');
    if (trendingSection) {
      trendingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    setShowSuggestions(false);
  };

  const filteredSuggestions = query
    ? popularSearches.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
          className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button className="text-gray-400 hover:text-orange-500">
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowSuggestions(false)}
          />
          <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border z-20 max-h-96 overflow-y-auto">
            {query && filteredSuggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-gray-500 px-2 py-1">Suggestions</div>
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion);
                      handleSearch(suggestion);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}

            {!query && recentSearches.length > 0 && (
              <div className="p-2 border-b">
                <div className="text-xs text-gray-500 px-2 py-1">Recent Searches</div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search);
                      handleSearch(search);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            )}

            {!query && (
              <div className="p-2">
                <div className="text-xs text-gray-500 px-2 py-1">AI Smart Suggestions</div>
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion);
                      handleSearch(suggestion);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2 text-sm"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded flex items-center justify-center text-white text-xs">
                      AI
                    </div>
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}

            {!query && (
              <div className="p-2 border-t">
                <div className="text-xs text-gray-500 px-2 py-1">Popular Searches</div>
                <div className="flex flex-wrap gap-2 p-2">
                  {popularSearches.slice(0, 6).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        handleSearch(search);
                      }}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
