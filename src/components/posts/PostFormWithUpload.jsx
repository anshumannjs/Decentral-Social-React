import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePosts } from '../../hooks/usePosts';
import FileUploader from './FileUploader';
import { uploadJSONToPinata } from '../../utils/pinata';
import toast from 'react-hot-toast';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  tags: z.string().optional(),
});

export default function PostFormWithUpload({ onSuccess }) {
  const { createPost, isCreating } = usePosts();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showMetadataForm, setShowMetadataForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  const handleFileUpload = (result) => {
    setUploadedFile(result);
    setShowMetadataForm(true);
  };

  console.log({uploadedFile})
  const onSubmit = async (data) => {
    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }

    try {
      const tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

      const metadata = {
        title: data.title,
        description: data.description || '',
        contentUrl: uploadedFile.url,
        contentHash: uploadedFile.ipfsHash,
        tags: tags,
        timestamp: Date.now(),
        version: '1.0',
      };

      toast.loading('Uploading metadata to IPFS...');

      const metadataResult = await uploadJSONToPinata(metadata, {
        name: `post-metadata-${Date.now()}`,
        keyvalues: {
          type: 'post-metadata',
          title: data.title,
          contentHash: uploadedFile.ipfsHash,
        },
      });

      toast.dismiss();
      toast.loading('Creating post on blockchain...');

      await createPost(metadataResult.url);
      
      toast.dismiss();
      
      reset();
      setUploadedFile(null);
      setShowMetadataForm(false);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.dismiss();
      console.error('Create post error:', error);
      toast.error(error.message || 'Failed to create post');
    }
  };

  const handleReset = () => {
    reset();
    setUploadedFile(null);
    setShowMetadataForm(false);
  };

  return (
    <div className="space-y-6">
      {!showMetadataForm ? (
        <FileUploader
          onUploadSuccess={handleFileUpload}
          onUploadStart={() => setIsUploading(true)}
        />
      ) : (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800">File uploaded successfully!</p>
                <p className="text-sm text-green-700 mt-1 break-all">
                  IPFS Hash: {uploadedFile.ipfsHash}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Size: {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Post Title *
              </label>
              <input
                id="title"
                type="text"
                {...register('title')}
                className="input-field"
                placeholder="Enter post title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="input-field resize-none"
                placeholder="Add a description to your post..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                {...register('tags')}
                className="input-field"
                placeholder="art, music, nft (comma separated)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add tags separated by commas
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isCreating}
                className="btn-primary flex-1"
              >
                {isCreating ? 'Creating Post...' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isCreating}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}