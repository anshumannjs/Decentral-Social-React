import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useConfig, useAccount, useChainId } from 'wagmi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { readContractData, writeContractData } from '../contracts/helpers';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';
import { data } from 'autoprefixer';

export function useProfile(address) {
  const config = useConfig();
  const chainId = useChainId();
  const { address: currentUser } = useAccount();
  const queryClient = useQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const targetAddress = address || currentUser;


  const query = useQuery({
    queryKey: ['profile', targetAddress, chainId],
    enabled: !!targetAddress && targetAddress !== '0x0000000000000000000000000000000000000000',
    retry: false,
    queryFn: async () => {
      if (!currentUser || currentUser === '0x0000000000000000000000000000000000000000') {
        toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
        return;
      }

      try {
        console.log("Fetching profile for address:", targetAddress);
        const data = await readContractData(
          config,
          'getUserProfile',
          [targetAddress],
          currentUser
        );

        console.log({ data })

        // Contract returns empty values for non-existent user
        if (!data || !data[0]) {
          return { exists: false };
        }

        return {
          username: data[0],
          bio: data[1],
          reputation: Number(data[2]),
          exists: true,
          postCount: Number(data[3]),
          followersCount: Number(data[4]),
          followingCount: Number(data[5]),
        };
      } catch (err) {
        // IMPORTANT:
        // Treat "profile not found" as NOT an error
        console.log({ err })
        return { exists: false };
      }
    },
  });

  console.log({ data: query.data })


  const createProfile = async (username, bio) => {
    if (!currentUser) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    setIsCreating(true);
    try {
      console.log("hello")
      await writeContractData(config, 'register', [username, bio]);
      await queryClient.invalidateQueries({
        queryKey: ['profile', currentUser, chainId],
      });
      toast.success(SUCCESS_MESSAGES.PROFILE_CREATED);
    } catch (error) {
      console.error(error);
      console.log({ error })
      toast.error(ERROR_MESSAGES.TRANSACTION_FAILED);
    } finally {
      setIsCreating(false);
    }
  };

  // const updateProfile = async (username, bio) => {
  //   if (!currentUser) {
  //     toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
  //     return;
  //   }

  //   setIsUpdating(true);
  //   try {
  //     await writeContractData(config, 'updateProfile', [username, bio]);
  //     await queryClient.invalidateQueries({
  //       queryKey: ['profile', currentUser, chainId],
  //     });
  //     toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(ERROR_MESSAGES.TRANSACTION_FAILED);
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  const updateUsername = async (username) => {
    if (!currentUser) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    setIsUpdating(true);
    try {
      await writeContractData(config, 'updateUserName', [username]);
      await queryClient.invalidateQueries({
        queryKey: ['profile', currentUser, chainId],
      });
      toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED);
    } catch (error) {
      console.error(error);
      toast.error(ERROR_MESSAGES.TRANSACTION_FAILED);
    } finally {
      setIsUpdating(false);
    }
  }

  const updateBio = async (bio) => {
    if (!currentUser) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    setIsUpdating(true);
    try {
      await writeContractData(config, 'updateBio', [bio]);
      await queryClient.invalidateQueries({
        queryKey: ['profile', currentUser, chainId],
      });
      toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED);
    } catch (error) {
      console.error(error);
      toast.error(ERROR_MESSAGES.TRANSACTION_FAILED);
    } finally {
      setIsUpdating(false);
    }
  }

  return {
    profile: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createProfile,
    updateUsername,
    updateBio,
    isCreating,
    isUpdating,
  };
}
