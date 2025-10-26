import { useState, useEffect, useCallback } from 'react';
import { Search, TrendingUp, Clock, X } from 'lucide-react';
import { Input } from './ui/input';

interface SearchSuggestion {
  text: string;
  type: 'trending' | 'recent' | 'suggestion';
}

interface IntelligentSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  allProducts?: any[];
}

export function IntelligentSearch({ 
  onSearch, 
  placeholder = "Search products...",
  allProducts = []
}: IntelligentSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [correctedQuery, setCorrectedQuery] = useState('');

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('magrstore_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Intelligent search with auto-correct and synonyms
  const intelligentSearch = useCallback((searchQuery: string) => {
    let processedQuery = searchQuery.toLowerCase().trim();
    
    // Common misspellings and synonyms
    const synonymMap: Record<string, string[]> = {
      'phone': ['mobile', 'smartphone', 'cell'],
      'laptop': ['computer', 'notebook', 'pc'],
      'tv': ['television', 'smart tv', 'lcd'],
      'shoe': ['shoes', 'footwear', 'sneaker', 'sneakers'],
      'perfume': ['fragrance', 'cologne', 'scent'],
      'printer': ['printing', 'print'],
      'toner': ['cartridge', 'ink'],
    };

    // Auto-correct common misspellings
    const corrections: Record<string, string> = {
      'fone': 'phone',
      'phon': 'phone',
      'compter': 'computer',
      'labtop': 'laptop',
      'shose': 'shoes',
      'shoos': 'shoes',
      'parfum': 'perfume',
      'televison': 'television',
      'priner': 'printer',
    };

    // Check for corrections
    const words = processedQuery.split(' ');
    let corrected = false;
    const correctedWords = words.map(word => {
      if (corrections[word]) {
        corrected = true;
        return corrections[word];
      }
      return word;
    });

    if (corrected) {
      const correctedText = correctedWords.join(' ');
      setCorrectedQuery(correctedText);
      processedQuery = correctedText;
    } else {
      setCorrectedQuery('');
    }

    return processedQuery;
  }, []);

  // Generate suggestions based on input
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const processedQuery = intelligentSearch(query);
    const newSuggestions: SearchSuggestion[] = [];

    // Add trending searches
    const trending = [
      'iPhone 15 Pro',
      'Samsung Galaxy S24',
      'MacBook Air',
      'Nike Air Max',
      'PlayStation 5',
      'HP Printer',
    ];

    trending
      .filter(t => t.toLowerCase().includes(processedQuery))
      .forEach(t => {
        newSuggestions.push({ text: t, type: 'trending' });
      });

    // Add product-based suggestions
    if (allProducts.length > 0) {
      const productSuggestions = allProducts
        .filter(p => p.name.toLowerCase().includes(processedQuery))
        .slice(0, 5)
        .map(p => ({ text: p.name, type: 'suggestion' as const }));
      
      newSuggestions.push(...productSuggestions);
    }

    // Add category suggestions
    const categories = [
      'Electronics', 'Fashion', 'Beauty', 'Home & Garden', 
      'Sports', 'Toys', 'Laptops', 'Mobile Phones', 'Printers',
      'Shoes', 'Perfumes', 'Food Items', 'Solar & Power'
    ];

    categories
      .filter(c => c.toLowerCase().includes(processedQuery))
      .forEach(c => {
        newSuggestions.push({ text: c, type: 'suggestion' });
      });

    setSuggestions(newSuggestions.slice(0, 8));
  }, [query, allProducts, intelligentSearch]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const processedQuery = intelligentSearch(searchQuery);
    
    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('magrstore_recent_searches', JSON.stringify(updated));

    onSearch(processedQuery);
    setShowSuggestions(false);
    setQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('magrstore_recent_searches');
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 pr-4 w-full"
        />
      </form>

      {/* Auto-correct suggestion */}
      {correctedQuery && (
        <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg p-2 z-50">
          <p className="text-sm text-gray-600">
            Did you mean: <button 
              onClick={() => handleSearch(correctedQuery)}
              className="text-orange-500 hover:underline font-medium"
            >
              {correctedQuery}
            </button>
          </p>
        </div>
      )}

      {/* Search suggestions dropdown */}
      {showSuggestions && (query || recentSearches.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {/* Recent searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-2 border-b">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-gray-500 uppercase">Recent Searches</h4>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-orange-500 hover:underline"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion.text)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                >
                  {suggestion.type === 'trending' ? (
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                  ) : (
                    <Search className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="flex-1">{suggestion.text}</span>
                  {suggestion.type === 'trending' && (
                    <span className="text-xs text-orange-500">Trending</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {query && suggestions.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
