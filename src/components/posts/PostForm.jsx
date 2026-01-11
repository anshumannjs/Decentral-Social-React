import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePosts } from '../../hooks/usePosts';

const postSchema = z.object({
  contentURI: z.string().url('Please enter a valid URL').min(1, 'Content URI is required'),
});

export default function PostForm({ onSuccess }) {
  const { createPost, isCreating } = usePosts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data) => {
    await createPost(data.contentURI);
    reset();
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="contentURI" className="block text-sm font-medium text-gray-700 mb-1">
          Content URI
        </label>
        <input
          id="contentURI"
          type="text"
          {...register('contentURI')}
          className="input-field"
          placeholder="https://ipfs.io/ipfs/..."
        />
        {errors.contentURI && (
          <p className="mt-1 text-sm text-red-600">{errors.contentURI.message}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Enter the URI to your content (IPFS, Arweave, etc.)
        </p>
      </div>

      <button
        type="submit"
        disabled={isCreating}
        className="btn-primary w-full"
      >
        {isCreating ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}