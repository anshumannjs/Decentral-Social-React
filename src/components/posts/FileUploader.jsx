import { useState, useRef, useEffect } from 'react';
import { uploadFileToPinata, isValidFileType, formatFileSize, testPinataConnection } from '../../utils/pinata';
import toast from 'react-hot-toast';

const ALLOWED_FILE_TYPES = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'text/*',
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function FileUploader({ onUploadSuccess, onUploadStart }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pinataConnected, setPinataConnected] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const isConnected = await testPinataConnection();
        setPinataConnected(isConnected);
        if (!isConnected) {
          toast.error('Pinata connection failed. Please check your API key.');
        }
      } catch (error) {
        setPinataConnected(false);
        console.error('Pinata connection error:', error);
      }
    }
    checkConnection();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }

    if (!isValidFileType(file, ALLOWED_FILE_TYPES)) {
      toast.error('Invalid file type. Please upload an image, video, audio, PDF, or text file.');
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else if (file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    if (pinataConnected === false) {
      toast.error('Pinata is not connected. Please check your configuration.');
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    if (onUploadStart) onUploadStart();

    try {
      setUploadProgress(30);
      
      const result = await uploadFileToPinata(selectedFile, {
        name: selectedFile.name,
        keyvalues: {
          type: selectedFile.type,
          size: selectedFile.size.toString(),
          uploadedAt: new Date().toISOString(),
        },
      });

      setUploadProgress(100);
      toast.success('File uploaded successfully to IPFS!');
      
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }

      setSelectedFile(null);
      setPreview(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileSelect(fakeEvent);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Content
        </label>
        
        {pinataConnected === false && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ Pinata connection failed. Please check your API key in .env file.
            </p>
          </div>
        )}

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors"
        >
          {!selectedFile ? (
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4">
                <label className="btn-primary cursor-pointer inline-block">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept={ALLOWED_FILE_TYPES.join(',')}
                    className="hidden"
                    disabled={uploading || pinataConnected === false}
                  />
                  Choose File
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                or drag and drop
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          )}
        </div>
        
        <p className="mt-2 text-xs text-gray-500">
          Supported: Images, Videos, Audio, PDFs, Text files (Max {formatFileSize(MAX_FILE_SIZE)})
        </p>
      </div>

      {preview && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {selectedFile?.type.startsWith('image/') && (
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
          )}
          {selectedFile?.type.startsWith('video/') && (
            <video
              src={preview}
              controls
              className="max-h-64 mx-auto rounded-lg"
            />
          )}
          {selectedFile?.type.startsWith('audio/') && (
            <div className="flex items-center justify-center py-8">
              <audio
                src={preview}
                controls
                className="w-full max-w-md"
              />
            </div>
          )}
        </div>
      )}

      {selectedFile && (
        <div className="space-y-3">
          {uploading && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Uploading to IPFS...</span>
                <span className="text-sm font-medium text-primary-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleUpload}
              disabled={uploading || pinataConnected === false}
              className="btn-primary flex-1"
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading to IPFS...
                </span>
              ) : (
                'Upload to IPFS'
              )}
            </button>
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="btn-secondary"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}