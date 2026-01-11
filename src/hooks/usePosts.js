import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useConfig, useAccount } from 'wagmi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { readContractData, writeContractData } from '../contracts/helpers';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, POSTS_PER_PAGE } from '../utils/constants';

export function usePosts(feedType = 'global', page = 1, userAddress = null) {
  const config = useConfig();
  const { address: currentUser } = useAccount();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: postCount } = useQuery({
    queryKey: ['postCount'],
    queryFn: async () => {
      const count = await readContractData(config, 'getPostCount');
      return Number(count);
    },
  });

  const { data: userPostIds } = useQuery({
    queryKey: ['userPosts', userAddress],
    queryFn: async () => {
      if (!userAddress) return [];
      const ids = await readContractData(config, 'getUserPosts', [userAddress]);
      return ids.map(id => Number(id));
    },
    enabled: !!userAddress,
  });

  const { data: followingPostIds } = useQuery({
    queryKey: ['followingPosts', currentUser],
    queryFn: async () => {
      if (!currentUser) return [];
      const ids = await readContractData(config, 'getFollowingPosts', [currentUser]);
      return ids.map(id => Number(id));
    },
    enabled: feedType === 'following' && !!currentUser,
  });

  const getPostIds = () => {
    if (userAddress) {
      return userPostIds || [];
    }
    if (feedType === 'following') {
      return followingPostIds || [];
    }
    if (!postCount) return [];
    const ids = [];
    for (let i = postCount; i > 0; i--) {
      ids.push(i);
    }
    return ids;
  };

  const postIds = getPostIds();
  const totalPosts = postIds.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPageIds = postIds.slice(startIndex, endIndex);

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', feedType, page, userAddress, currentPageIds],
    queryFn: async () => {
      if (currentPageIds.length === 0) return [];

      const postsData = await Promise.all(
        currentPageIds.map(async (id) => {
          try {
            const data = await readContractData(config, 'getPost', [id], currentUser);
            return {
              id: Number(data[0]),
              author: data[1],
              contentURI: data[2],
              timestamp: data[3],
              likes: data[4],
            };
          } catch (error) {
            console.error(`Error fetching post ${id}:`, error);
            return null;
          }
        })
      );

      return postsData.filter(post => post !== null);
    },
    enabled: currentPageIds.length > 0,
  });

  const getGlobalFeedPostIds = async() => {
    try {
      const data = await readContractData(config, 'fetchGlobalPosts', [page, 5], currentUser);
      return data.map(post => ({
        id: (post)}))
    } catch (error) {
      console.error(`Error fetching post :`, error);
      return null;
    }
  }

  const getFollowingPostsIds = async() => {
    try {
      const data = await readContractData(config, 'fetchFollowingPosts', [page, 5], currentUser);
      return data.map(post => ({
        id: (post)}))
    } catch (error) {
      console.error(`Error fetching post :`, error);
      return null;
    }
  }

  const getUserPostsIds = async(userAddress) => {
    try {
      const data = await readContractData(config, 'getUserPosts', [userAddress], currentUser);
      return data.map(post => ({
        id: (post)}))
    } catch (error) {
      console.error(`Error fetching posts for user ${userAddress}:`, error);
      return null;
    }
  }

  const getPostBypostId = async(postId) => {
    try {
      const data = await readContractData(config, 'getPostDetails', [postId], currentUser);
      console.log({data});
      return {
        author: (data[0]),
        contentURI: data[1],
        timestamp: data[2],
        likeCount: Number(data[3]),
        dislikeCount: Number(data[4]),
        reportCount: Number(data[5]),
        id: postId
      };
    } catch (error) {
      console.error(`Error fetching post ${postId}:`, error);
      return null;
    }
  }

  const createPost = async (contentURI) => {
    if (!currentUser) {
      toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    setIsCreating(true);
    try {
      await writeContractData(config, 'createPost', [contentURI]);
      await queryClient.invalidateQueries({ queryKey: ['postCount'] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      toast.success(SUCCESS_MESSAGES.POST_CREATED);
    } catch (error) {
      console.error('Create post error:', error);
      toast.error(ERROR_MESSAGES.TRANSACTION_FAILED);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    getGlobalFeedPostIds,
    getFollowingPostsIds,
    getPostBypostId,
    posts,
    isLoading,
    error,
    createPost,
    isCreating,
    totalPages,
    currentPage: page,
    getUserPostsIds
  };
}