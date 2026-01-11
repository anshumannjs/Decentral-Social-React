import { useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import SearchResults from './SearchResults';

export default function SearchBar({ onSelectUser }) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: searchResult, isLoading, error } = useSearch(query);

  const handleSelect = (address) => {
    setQuery('');
    setShowResults(false);
    onSelectUser(address);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        placeholder="Search username..."
        className="input-field text-sm"
      />
      {showResults && query.length > 0 && (
        <SearchResults
          result={searchResult}
          isLoading={isLoading}
          error={error}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}