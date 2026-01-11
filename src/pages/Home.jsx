import { useState, useEffect, use } from 'react';
import { useAccount } from 'wagmi';
import { useConfig } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import FeedTabs from '../components/feed/FeedTabs';
import PostCardWithMedia from '../components/posts/PostCardWithMedia';
import Pagination from '../components/feed/Pagination';
import { usePosts } from '../hooks/usePosts';
import { readContractData } from '../contracts/helpers';
import { set } from 'zod/v4-mini';

export default function Home() {
  const { address } = useAccount();
  const config = useConfig();
  const [activeTab, setActiveTab] = useState('global');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [postIds, setPostIds] = useState([]);

  const { getGlobalFeedPostIds, isLoading, error, totalPages, getPostBypostId, getFollowingPostsIds } = usePosts(activeTab, currentPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    setPosts([]);
    const fetchPosts = async () => {
      if (activeTab === 'global') {
        try{
          const temp = await getGlobalFeedPostIds();
          setPostIds(temp);
        } catch (error) {
          console.error('Error fetching global feed posts:', error);
        }
      }
      else{
        try{
          const temp = await getFollowingPostsIds();
          setPostIds(temp);
        } catch (error) {
          console.error('Error fetching following feed posts:', error);
        }
      }
    };
    fetchPosts();
  }, [activeTab]);

  useEffect(()=>{
    if(postIds?.length>0){
    const fetchPostDetails = async () => {
      const postDetails = [];
      for(const postId of postIds){
        try{
          const postData=await getPostBypostId(postId?.id);
          postData?postDetails.push(postData):console.log(`No post data found for postId ${postId}`);
        } catch (error) {
          console.error(`Error fetching post details for postId ${postId}:`, error);
        }
      }
      setPosts(postDetails.length > 0 ? postDetails : []);
    }
    fetchPostDetails();
  }
  }, [postIds]);

  const authorAddresses = posts?.map(post => post?.author?.toLowerCase()).filter(Boolean) || [];

  const { data: profiles,  } = useQuery({
    queryKey: ['profiles', authorAddresses],
    queryFn: async () => {
      console.log('Fetching profiles for addresses:', authorAddresses);
      const mp=new Map()
      if (authorAddresses.length === 0) return {};
      
      const profilesData = await Promise.all(
        authorAddresses.map(async (addr) => {
          if(mp[addr]) return mp[addr];
          try {
            const data = await readContractData(config, 'getUserProfile', [addr], address);
            console.log({ data });
            mp[addr]=data;
            return {
              address: addr,
              username: data[0],
              bio: data[1],
              exists: data[3],
            };
          } catch (error) {
            console.error(`Error fetching profile for address ${addr}:`, error);
            return { address: addr, exists: false };
          }
        })
      );

      return profilesData.reduce((acc, profile) => {
        if (profile.exists) {
          acc[profile.address] = profile;
        }
        return acc;
      }, {});
    },
    enabled: authorAddresses.length > 0,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-8">
          <p className="text-red-600">Error loading posts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Feed</h2>
        <p className="text-gray-600">Discover and share content with the community</p>
      </div>
      
      <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts?.map((post) => (
            <PostCardWithMedia
              key={post?.id}
              post={post}
              authorProfile={profiles?.[post?.author?.toLowerCase()]}
            />
          ))
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-500">No posts yet</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}