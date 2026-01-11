import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useProfile } from '../hooks/useProfile';

export default function NotFound() {
  const { address, isConnected } = useAccount();
  const { profile } = useProfile(address);
  
  const isAuthenticated = isConnected && profile?.exists;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-8">Page not found</p>
        <Link to={isAuthenticated ? "/" : "/auth"} className="btn-primary inline-block">
          {isAuthenticated ? 'Go Home' : 'Go to Login'}
        </Link>
      </div>
    </div>
  );
}