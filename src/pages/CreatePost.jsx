import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import PostFormWithUpload from '../components/posts/PostFormWithUpload';

export default function CreatePost() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <p className="text-gray-600">Please connect your wallet to create a post</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Post</h1>
        <p className="text-gray-600 mb-6">
          Upload your content to IPFS and share it with the community
        </p>
        <PostFormWithUpload onSuccess={() => navigate('/')} />
      </div>
    </div>
  );
}