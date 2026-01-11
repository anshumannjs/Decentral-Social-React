import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import WalletButton from './WalletButton';
import SearchBar from '../search/SearchBar';
import { useProfile } from '../../hooks/useProfile';

export default function Header() {
  const { address, isConnected } = useAccount();
  const { profile } = useProfile(address);
  const navigate = useNavigate();

  const handleSearch = (searchAddress) => {
    navigate(`/profile/${searchAddress}`);
  };

  const isAuthenticated = isConnected && profile?.exists;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to={isAuthenticated ? "/" : "/auth"} className="text-2xl font-bold text-primary-600">
              Web3Social
            </Link>
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Feed
                </Link>
                <Link
                  to="/create-post"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Create Post
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="hidden md:block w-64">
                <SearchBar onSelectUser={handleSearch} />
              </div>
            )}
            {isConnected && <WalletButton />}
          </div>
        </div>
      </div>
    </header>
  );
}