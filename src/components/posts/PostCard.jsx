import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { formatAddress, formatTimestamp, formatNumber } from '../../utils/format';
import { useLike } from '../../hooks/useLike';

export default function PostCard({ post, authorProfile }) {
  const { address: currentUser } = useAccount();
  const { hasLiked, like, isLiking } = useLike(post.id, currentUser);

  const displayName = authorProfile?.username || formatAddress(post.author);
  console.log({authorProfile, post})

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <Link to={`/profile/${post.author}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {displayName[0]?.toUpperCase()}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Link
              to={`/profile/${post.author}`}
              className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {displayName}
            </Link>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">
              {formatTimestamp(post.timestamp)}
            </span>
          </div>

          <div className="mb-3">
            <a
              href={post.contentURI}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 break-all"
            >
              {post.contentURI}
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={like}
              disabled={isLiking || hasLiked}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className={`w-5 h-5 ${hasLiked ? 'fill-red-600 text-red-600' : ''}`}
                fill={hasLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                {formatNumber(Number(post.likes))}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}