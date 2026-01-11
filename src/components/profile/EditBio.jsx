import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile } from '../../hooks/useProfile';

const bioSchema = z.object({
  bio: z.string().max(200, 'Bio must be less than 200 characters'),
});

export default function EditBio({ currentUsername, currentBio, onSuccess, onCancel }) {
  const { updateBio, isUpdating } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      bio: currentBio || '',
    },
  });

  const onSubmit = async (data) => {
    await updateBio(data.bio);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
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
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isUpdating}
          className="btn-primary flex-1"
        >
          {isUpdating ? 'Updating...' : 'Update Bio'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isUpdating}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}