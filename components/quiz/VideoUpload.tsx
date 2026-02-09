import React, { useState, useRef } from 'react';

interface VideoUploadProps {
  onUpload: (base64: string, mimeType: string, fileName: string) => void;
  isLoading: boolean;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ onUpload, isLoading }) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    // Simple validation
    if (!file.type.startsWith('video/')) {
      setError("Please select a valid video file.");
      return;
    }

    // Limit size to avoid browser crash on base64 conversion (e.g., 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError("File is too large. Please upload a video smaller than 20MB for this demo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove Data URL prefix to get raw base64
      const base64Data = result.split(',')[1];
      onUpload(base64Data, file.type, file.name);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-200 w-full h-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload a Video</h2>
        <p className="text-gray-500">
          Upload a short educational video to generate a quiz.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
        disabled={isLoading}
      />

      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        className={`
          bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform active:scale-95 text-lg
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          "Add Video"
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-100 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
