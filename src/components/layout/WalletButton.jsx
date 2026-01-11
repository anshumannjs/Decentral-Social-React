import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Menu } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { formatAddress } from '../../utils/format';
import { cn } from '../../utils/cn';
import { useProfile } from '../../hooks/useProfile';

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { profile } = useProfile(address);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (connector) => {
    setIsConnecting(true);
    try {
      await connect({ connector });
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    navigate('/auth');
  };

  if (!isConnected) {
    return (
      <Menu as="div" className="relative">
        <Menu.Button className="btn-primary">
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 divide-y divide-gray-100 focus:outline-none">
          {connectors.map((connector) => (
            <Menu.Item key={connector.id}>
              {({ active }) => (
                <button
                  onClick={() => handleConnect(connector)}
                  disabled={isConnecting}
                  className={cn(
                    'w-full text-left px-4 py-3 text-sm font-medium',
                    active ? 'bg-gray-50' : '',
                    'disabled:opacity-50'
                  )}
                >
                  {connector.name}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
    );
  }

  const displayName = profile?.username || formatAddress(address);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-2 btn-secondary">
        {profile?.username && (
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {/* {profile.username[0].toUpperCase()} */}
            <img src={`https://ui-avatars.com/api/?name=${profile?.username || 'Anonymous'}&background=random&rounded=true`} alt="" />
          </div>
        )}
        <span>{displayName}</span>
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 divide-y divide-gray-100 focus:outline-none">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => navigate(`/profile/${address}`)}
              className={cn(
                'w-full text-left px-4 py-3 text-sm font-medium',
                active ? 'bg-gray-50' : ''
              )}
            >
              My Profile
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={handleDisconnect}
              className={cn(
                'w-full text-left px-4 py-3 text-sm font-medium text-red-600',
                active ? 'bg-gray-50' : ''
              )}
            >
              Disconnect
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}