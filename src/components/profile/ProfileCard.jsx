import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatAddress, formatNumber } from '../../utils/format';
import { useFollow } from '../../hooks/useFollow';
import EditUsername from './EditUsername';
import EditBio from './EditBio';

export default function ProfileCard({ profile, address, followerCount, followingCount }) {
  const { address: currentUser } = useAccount();
  const { isFollowing, follow, unfollow, isLoading } = useFollow(address);
  const [editMode, setEditMode] = useState(null);

  const isOwnProfile = currentUser?.toLowerCase() === address?.toLowerCase();

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollow();
    } else {
      await follow();
    }
  };

  const handleEditSuccess = () => {
    setEditMode(null);
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {/* <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {profile?.username?.[0]?.toUpperCase() || '?'}
            </div> */}
            <img src={`https://ui-avatars.com/api/?name=${profile?.username || 'Anonymous'}&background=random&rounded=true`} alt="" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.username || 'Anonymous'}
              </h1>
              <p className="text-sm text-gray-500">{formatAddress(address)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-4">
            <div>
              <span className="font-bold text-gray-900">{formatNumber(followerCount || 0)}</span>
              <span className="text-gray-600 ml-1">Followers</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">{formatNumber(followingCount || 0)}</span>
              <span className="text-gray-600 ml-1">Following</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">{profile?.reputation?.toString() || '0'}</span>
              <span className="text-gray-600 ml-1">Reputation</span>
            </div>
          </div>
        </div>

        {!isOwnProfile && currentUser && (
          <button
            onClick={handleFollowToggle}
            disabled={isLoading}
            className={isFollowing ? 'btn-secondary' : 'btn-primary'}
          >
            {isLoading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      {isOwnProfile && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-extrabold text-gray-700">Username</label>
              {editMode !== 'username' && (
                <button
                  onClick={() => setEditMode('username')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Edit
                </button>
              )}
            </div>
            {editMode === 'username' ? (
              <EditUsername
                currentUsername={profile?.username}
                currentBio={profile?.bio}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditMode(null)}
              />
            ) : (
              <p className="text-gray-900">{profile?.username || 'Not set'}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-extrabold text-gray-700">Bio</label>
              {editMode !== 'bio' && (
                <button
                  onClick={() => setEditMode('bio')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Edit
                </button>
              )}
            </div>
            {editMode === 'bio' ? (
              <EditBio
                currentUsername={profile?.username}
                currentBio={profile?.bio}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditMode(null)}
              />
            ) : (
              <p className="text-gray-700">{profile?.bio || 'No bio yet'}</p>
            )}
          </div>
        </div>
      )}

      {!isOwnProfile && profile?.bio && (
        <div className="pt-4 border-t border-gray-200">
          <label className="text-sm font-medium text-gray-700 block mb-2">Bio</label>
          <p className="text-gray-700">{profile.bio}</p>
        </div>
      )}
    </div>
  );
}