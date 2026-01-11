import { useConfig } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { readContractData } from '../contracts/helpers';

export function useSearch(username) {
  const config = useConfig();

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', username],
    queryFn: async () => {
      if (!username || username.length < 3) return null;
      
      try {
        const address = await readContractData(config, 'searchByUsername', [username]);
        
        if (!address || address === '0x0000000000000000000000000000000000000000') {
          return null;
        }

        const profileData = await readContractData(config, 'getProfile', [address]);
        
        return {
          address,
          username: profileData[0],
          bio: profileData[1],
        };
      } catch (error) {
        throw error;
      }
    },
    enabled: username.length >= 3,
    retry: false,
  });

  return {
    data,
    isLoading,
    error,
  };
}