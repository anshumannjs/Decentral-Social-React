import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile } from '../../hooks/useProfile';

const usernameSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
});

export default function EditUsername({ currentUsername, currentBio, onSuccess, onCancel }) {
  const { updateUsername, isUpdating } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: currentUsername || '',
    },
  });

  const onSubmit = async (data) => {
    await updateUsername(data.username);
    if (onSuccess) onSuccess();
  };

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
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isUpdating}
          className="btn-primary flex-1"
        >
          {isUpdating ? 'Updating...' : 'Update Username'}
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