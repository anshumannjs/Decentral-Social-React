import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount, useConfig } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import ProfileCard from '../components/profile/ProfileCard';
import PostCardWithMedia from '../components/posts/PostCardWithMedia';
import Pagination from '../components/feed/Pagination';
import { useProfile } from '../hooks/useProfile';
import { useFollow } from '../hooks/useFollow';
import { usePosts } from '../hooks/usePosts';
import { readContractData } from '../contracts/helpers';

export default function Profile() {
  const { address: profileAddress } = useParams();
  const { address: currentUser } = useAccount();
  const config = useConfig();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [postIds, setPostIds] = useState([]);

  const { profile, isLoading: profileLoading } = useProfile(profileAddress);
  const { followerCount, followingCount } = useFollow(profileAddress);
  const { getUserPostsIds, isLoading: postsLoading, totalPages, getPostBypostId } = usePosts('user', currentPage, profileAddress);
  console.log({profile})

  useEffect(() => {
      setCurrentPage(1);
    }, [profileAddress]);
  
    useEffect(() => {
      setPosts([]);
      const fetchPosts = async () => {
        if (!profileAddress) return;
          try{
            const temp = await getUserPostsIds(profileAddress);
            setPostIds(temp);
          } catch (error) {
            console.error('Error fetching user posts:', error);
          }
      };
      fetchPosts();
    }, [profileAddress]);
  
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
              const data = await readContractData(config, 'getUserProfile', [addr], currentUser);
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

  if (profileLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card animate-pulse">
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  console.log({posts, profiles})

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProfileCard
        profile={profile}
        address={profileAddress}
        followerCount={profile?.followersCount || followerCount}
        followingCount={profile?.followingCount || followingCount}
      />

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Posts</h3>
        <div className="space-y-4">
          {postsLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            ))
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCardWithMedia
                key={post.id}
                post={post}
                authorProfile={profiles?.[post.author?.toLowerCase()]}
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
    </div>
  );
}