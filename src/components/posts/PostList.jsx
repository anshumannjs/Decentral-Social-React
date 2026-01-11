import PostCard from './PostCard';
import PostSkeleton from './PostSkeleton';

export default function PostList({ posts, profiles, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-8">
        <p className="text-red-600">Error loading posts</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          authorProfile={profiles?.[post.author?.toLowerCase()]}
        />
      ))}
    </div>
  );
}