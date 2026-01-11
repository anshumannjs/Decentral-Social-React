import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useConfig, useAccount, useChainId } from 'wagmi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { readContractData, writeContractData } from '../contracts/helpers';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';

export function useFollow(targetAddress) {
  const config = useConfig();
  const chainId = useChainId();
  const { address: currentUser } = useAccount();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: isFollowing } = useQuery({
    queryKey: ['isFollowing', currentUser, targetAddress],
    queryFn: async () => {
      if (!currentUser || !targetAddress) return false;
      return await readContractData(config, 'isFollowing', [targetAddress], currentUser);
    },
    enabled: !!currentUser && !!targetAddress,
  });

  const { data: followerCount } = useQuery({
    queryKey: ['followerCount', targetAddress],
    queryFn: async () => {
      if (!targetAddress) return 0;
      const count = await readContractData(config, 'getFollowerCount', [targetAddress]);
      return Number(count);
    },
    enabled: !!targetAddress,
  });

  const { data: followingCount } = useQuery({
    queryKey: ['followingCount', targetAddress],
    queryFn: async () => {
      if (!targetAddress) return 0;
      const count = await readContractData(config, 'getFollowingCount', [targetAddress]);
      return Number(count);
    },
    enabled: !!targetAddress,
  });

  const follow = async () => {
    if (!currentUser) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    setIsLoading(true);
    try {
      await writeContractData(config, 'follow', [targetAddress]);
      await queryClient.invalidateQueries({ queryKey: ['isFollowing'] });
      // await queryClient.invalidateQueries({ queryKey: ['followerCount', targetAddress] });
      // await queryClient.invalidateQueries({ queryKey: ['followingCount', currentUser] });
      await queryClient.invalidateQueries({ queryKey: ['profile', targetAddress, chainId] });
      await queryClient.invalidateQueries({ queryKey: ['profile', currentUser, chainId] });
      toast.success(SUCCESS_MESSAGES.FOLLOWED);
    } catch (error) {
      console.error('Follow error:', error);
      toast.error(ERROR_MESSAGES.TRANSACTION_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const unfollow = async () => {
    if (!currentUser) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    setIsLoading(true);
    try {
      await writeContractData(config, 'unfollow', [targetAddress]);
      await queryClient.invalidateQueries({ queryKey: ['isFollowing'] });
      // await queryClient.invalidateQueries({ queryKey: ['followerCount', targetAddress] });
      // await queryClient.invalidateQueries({ queryKey: ['followingCount', currentUser] });
      await queryClient.invalidateQueries({ queryKey: ['profile', targetAddress, chainId] });
      await queryClient.invalidateQueries({ queryKey: ['profile', currentUser, chainId] });
      toast.success(SUCCESS_MESSAGES.UNFOLLOWED);
    } catch (error) {
      console.error('Unfollow error:', error);
      toast.error(ERROR_MESSAGES.TRANSACTION_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFollowing,
    followerCount,
    followingCount,
    follow,
    unfollow,
    isLoading,
  };
}