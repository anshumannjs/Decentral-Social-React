import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { formatAddress, formatTimestamp, formatNumber } from '../../utils/format';
import { useLike } from '../../hooks/useLike';
import { usePosts } from '../../hooks/usePosts';

export default function PostCardWithMedia({ post: initialPost, authorProfile }) {
  const { address: currentUser } = useAccount();
  const { getPostBypostId } = usePosts();

  const [post, setPost] = useState(initialPost);
  const [metadata, setMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [fileType, setFileType] = useState('Checking...');

  const categorizeMimeType = (mimeType) => {
  if (!mimeType) return 'Unknown';

  const [type, subtype] = mimeType.toLowerCase().split('/');

  // Primary categorization by main type
  switch (type) {
    case 'image': return 'Image';
    case 'video': return 'Video';
    case 'audio': return 'Audio';
    case 'text': return 'Text Document';
    case 'font': return 'Font File';
    case 'application':
      // Sub-categorization for generic 'application' types
      if (subtype.includes('pdf')) return 'PDF Document';
      if (subtype.includes('json')) return 'Data/JSON';
      if (subtype.includes('zip') || subtype.includes('compressed')) return 'Archive';
      if (subtype.includes('msword') || subtype.includes('officedocument')) return 'Document';
      return 'Application/Binary';
    default:
      return 'Other';
  }
};

  useEffect(() => {
    const pinataUrl=metadata?.contentUrl
    const fetchHeader = async () => {
      try {
        // HEAD request only fetches metadata, saving bandwidth
        const response = await fetch(pinataUrl, { method: 'HEAD' });
        
        if (response.ok) {
          // Extract the Content-Type header
          const contentType = response.headers.get("Content-Type");
          setFileType(categorizeMimeType(contentType) || 'Unknown');
        } else {
          setFileType('Error: Link invalid');
        }
      } catch (error) {
        console.error("Fetch failed:", error);
        setFileType('CORS Error / Unavailable');
      }
    };

    if (metadata?.contentUrl) fetchHeader();
  }, [metadata?.contentUrl]);

  useEffect(() => {
    if (initialPost) setPost(initialPost);
  }, [initialPost]);

  const postId = post?.id ?? null;
  const { hasLiked, like, dislike, isLiking } = useLike(postId, currentUser);

  const displayName = useMemo(
    () => authorProfile?.username || (post ? formatAddress(post.author) : ''),
    [authorProfile, post]
  );

  /* ---------- Metadata ---------- */
  useEffect(() => {
    if (!post?.contentURI) return;

    setLoadingMetadata(true);
    setMetadata(null);

    const fetchMetadata = async () => {
      try {
        const res = await fetch(post.contentURI);
        const data = await res.json();
        setMetadata(data);
      } catch (err) {
        console.error(err);
        setMetadata(null);
      } finally {
        setLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, [post?.contentURI]);

  /* ---------- Refresh post after like ---------- */
  useEffect(() => {
    if (!postId) return;

    const refreshPost = async () => {
      try {
        const updated = await getPostBypostId(postId);
        if (updated) setPost(updated);
      } catch (err) {
        console.error(err);
      }
    };

    refreshPost();
  }, [hasLiked]);

  if (!post) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-48 bg-gray-200 rounded" />
      </div>
    );
  }

  console.log({fileType})

  /* ---------- Inline media renderer ---------- */
  const renderMedia = () => {
    if (!metadata?.contentUrl) return null;

    const resolvedUrl = (metadata?.contentUrl);
    const type = metadata?.type || metadata?.mimeType || '';

    if (!resolvedUrl) return null;
    console.log({metadata})

    if (fileType=='Image' || resolvedUrl.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
      return (
        <img
          src={resolvedUrl}
          alt={metadata.title}
          className="w-full rounded-lg max-h-96 object-cover"
        />
      );
    }

    if (fileType==('Video') || resolvedUrl.match(/\.(mp4|webm|ogg)$/i)) {
      return (
        <video
          src={resolvedUrl}
          controls
          className="w-full rounded-lg max-h-96"
        />
      );
    }

    if (fileType==('Audio') || resolvedUrl.match(/\.(mp3|wav|ogg)$/i)) {
      return (
        <audio
          src={resolvedUrl}
          controls
          className="w-full"
        />
      );
    }

    return ( 
      <a  href={resolvedUrl} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors" > 
      <div className="flex items-center space-x-2"> 
      {/* <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> 
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> 
      </svg>  */}
      {/* <span className="text-sm text-gray-700">View File on IPFS</span>  */}
      <img src={resolvedUrl} alt="IPFS image" /> 
      </div> 
      </a> 
      );
  };
console.log({post})


  return (
    <div className="card hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <Link to={`/profile/${post.author}`}>
          <img
            src={`https://ui-avatars.com/api/?name=${authorProfile?.username || 'Anonymous'}&background=random&rounded=true`}
            alt=""
            className="w-12 h-12 rounded-full"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <Link
              to={`/profile/${post.author}`}
              className="font-semibold text-gray-900 hover:text-primary-600"
            >
              {displayName}
            </Link>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">
              {formatTimestamp(post.timestamp)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {loadingMetadata ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      ) : metadata ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{metadata.title}</h3>
          {metadata.description && (
            <p className="text-gray-700">{metadata.description}</p>
          )}
          {renderMedia()}
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200">
        {/* LIKE */}
        <button
          onClick={like}
          disabled={isLiking || hasLiked}
          className="flex items-center space-x-1 text-gray-600 hover:text-red-600 disabled:opacity-50"
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
          <span>{formatNumber(post.likeCount)}</span>
        </button>

        {/* DISLIKE */}
        <button
          onClick={dislike}
          disabled={isLiking || !hasLiked}
          className="flex items-center space-x-1 text-gray-600 hover:text-red-600 disabled:opacity-50"
        >
          <svg
            className={`w-5 h-5 ${!hasLiked ? 'fill-red-600 text-red-600' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            fill={!hasLiked ? 'currentColor' : 'none'}
          >
            <path
              className={`${!hasLiked ? 'fill-red-600 text-red-600' : ''}`}
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M24 31L21 26L28 20L19 15L20 9.2C18.5 8.43 16.8 8 15 8
                 8.92 8 4 12.92 4 19
                 4 30 17 40 24 42
                 31 40 44 30 44 19
                 44 12.92 39.07 8 33 8
                 31.2 8 29.5 8.43 28 9.2"
            />
          </svg>
          <span>{formatNumber(post.dislikeCount)}</span>
        </button>

        {/* REPORT */}
        <div className="flex items-center space-x-1 text-gray-600">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 16.423q.262 0 .438-.177t.177-.438
                 q0-.262-.177-.439T12 15.192
                 q-.262 0-.438.177t-.177.439
                 q0 .261.177.438t.438.177ZM11.5
                 13.462h1V7.385h-1ZM8.673
                 20L4 15.336V8.673L8.664
                 4h6.663L20 8.664v6.663
                 L15.336 20Z"
            />
          </svg>
          <span>{formatNumber(post.reportCount)}</span>
        </div>
      </div>
    </div>
  );
}
