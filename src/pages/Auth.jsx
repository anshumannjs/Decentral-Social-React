import { use, useEffect, useState } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import WalletButton from '../components/layout/WalletButton';
import ProfileForm from '../components/profile/ProfileForm';
import { readContractData } from '../contracts/helpers';

export default function Auth() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile(address);
  const [authMode, setAuthMode] = useState('login');
  const config = useConfig();

   useEffect(() => {
    if (profile?.exists) {
      navigate('/', { replace: true });
    }
  }, [profile, navigate]);

//   useEffect(() => {
//     const fetchProfileData = async () => {
//     if(address && address!== '0x0000000000000000000000000000000000000000'){
//       console.log("Address connected:", address);
//       try{
//         const data = await readContractData(
//                   config,
//                   'getLoginUser',
//                   []
//               );
//     } catch (error) {
//       console.error('Error fetching profile data:', error);
//     }
//   }
//   else{
//     console.log("Address not connected");
//   }
// }
//     fetchProfileData();
//   }, [address]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="card max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Web3 Social
            </h1>
            <p className="text-gray-600">
              Connect your wallet to continue
            </p>
          </div>
          <WalletButton />
        </div>
      </div>
    );
  }

  if (isLoading) {
    console.log('Loading profile for address:', address);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

//   if (profile?.exists) {
//     navigate('/');
//     return null;
//   }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {authMode === 'login' ? 'Login' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {authMode === 'login' 
              ? 'Welcome back! Login to your account' 
              : 'Set up your profile to get started'}
          </p>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-3 font-medium transition-colors ${
              authMode === 'login'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-3 font-medium transition-colors ${
              authMode === 'signup'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {authMode === 'login' ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                No profile found for this wallet address. Please sign up to create an account.
              </p>
            </div>
            <button
              onClick={() => setAuthMode('signup')}
              className="btn-primary w-full"
            >
              Create New Account
            </button>
          </div>
        ) : (
          <ProfileForm
            existingProfile={null}
            onSuccess={() => navigate('/')}
          />
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Connected as: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
      </div>
    </div>
  );
}