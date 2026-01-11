import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useConfig, useAccount } from 'wagmi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { readContractData, writeContractData } from '../contracts/helpers';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';

export function useLike(postId, userAddress) {
  const config = useConfig();
  const { address: currentUser } = useAccount();
  const queryClient = useQueryClient();
  const [isLiking, setIsLiking] = useState(false);

  const targetAddress = userAddress || currentUser;

  const { data: hasLiked } = useQuery({
    queryKey: ['hasLiked', postId, targetAddress],
    queryFn: async () => {
      if (!targetAddress || !postId) return false;
      const interactionType = Number(await readContractData(config, 'getInteractionType', [postId], currentUser));
      console.log({interactionType})
      return interactionType === 1
    },
    enabled: !!targetAddress && !!postId,
  });

  const like = async () => {
    if (!currentUser) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    if (hasLiked) {
      return;
    }

    setIsLiking(true);
    try {
      await writeContractData(config, 'likePost', [postId]);
      await queryClient.invalidateQueries({ queryKey: ['hasLiked', postId] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(SUCCESS_MESSAGES.POST_LIKED);
    } catch (error) {
      console.error('Like error:', error);
      toast.error(ERROR_MESSAGES.TRANSACTION_FAILED);
    } finally {
      setIsLiking(false);
    }
  };

  const dislike = async () => {
    if (!currentUser) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    if (!hasLiked) {
      return;
    }

    setIsLiking(true);
    try {
      await writeContractData(config, 'dislikePost', [postId]);
      await queryClient.invalidateQueries({ queryKey: ['hasLiked', postId] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success("Post Disliked");
    } catch (error) {
      console.error('Dislike error:', error);
      toast.error(ERROR_MESSAGES.TRANSACTION_FAILED);
    } finally {
      setIsLiking(false);
    }
  };

  return {
    hasLiked:hasLiked==1,
    hasDisliked:hasLiked==2,
    like,
    isLiking,
    dislike
  };
}