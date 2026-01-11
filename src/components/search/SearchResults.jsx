import { formatAddress } from '../../utils/format';

export default function SearchResults({ result, isLoading, error, onSelect }) {
  if (isLoading) {
    return (
      <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-500">Searching...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <p className="text-sm text-red-600">User not found</p>
      </div>
    );
  }

  if (!result || !result.address) {
    return null;
  }

  return (
    <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => onSelect(result.address)}
        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <p className="font-medium text-gray-900">{result.username}</p>
        <p className="text-sm text-gray-500">{formatAddress(result.address)}</p>
      </button>
    </div>
  );
}