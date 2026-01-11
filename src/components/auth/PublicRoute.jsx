import { Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useProfile } from '../../hooks/useProfile';

export default function PublicRoute({ children }) {
  const { address, isConnected } = useAccount();
  const { profile, isLoading } = useProfile(address);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (isConnected && profile?.exists) {
    return <Navigate to="/" replace />;
  }

  return children;
}