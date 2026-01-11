import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile } from '../../hooks/useProfile';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  bio: z.string().max(200, 'Bio must be less than 200 characters'),
});

export default function ProfileForm({ existingProfile, onSuccess }) {
  const { createProfile, updateProfile, isCreating, isUpdating } = useProfile();
  const isEditing = !!existingProfile?.exists;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: existingProfile?.username || '',
      bio: existingProfile?.bio || '',
    },
  });

  const onSubmit = async (data) => {
    if (isEditing) {
      await updateProfile(data.username, data.bio);
    } else {
      console.log("hello")
      await createProfile(data.username, data.bio);
    }
    if (onSuccess) onSuccess();
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
             Username
    </label>
    <input
      id="username"
      type="text"
      {...register('username')}
      className="input-field"
      placeholder="Enter your username"
    />
    {errors.username && (
      <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
    )}
  </div>  <div>
    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
      Bio
    </label>
    <textarea
      id="bio"
      {...register('bio')}
      rows={4}
      className="input-field resize-none"
      placeholder="Tell us about yourself"
    />
    {errors.bio && (
      <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
    )}
  </div>  <button
    type="submit"
    disabled={isLoading}
    className="btn-primary w-full"
  >
    {isLoading ? 'Processing...' : isEditing ? 'Update Profile' : 'Create Profile'}
  </button>
</form>
);
}