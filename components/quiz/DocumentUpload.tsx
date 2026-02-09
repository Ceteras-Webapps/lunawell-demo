import React, { useState, useRef } from 'react';

interface DocumentUploadProps {
  onUpload: (base64: string, mimeType: string, fileName: string) => void;
  isLoading: boolean;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUpload, isLoading }) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    // Validation for PDF, Docx, Pages
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/x-iwork-pages-sffpages', // .pages (might vary by browser/OS, sometimes generic binary)
      'application/msword' // .doc
    ];
    
    // Looser check for extensions if mime type fails (common issue with .pages or weird windows configs)
    const validExtensions = ['.pdf', '.docx', '.pages', '.doc'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      setError("Please select a valid document (PDF, DOCX, PAGES).");
      return;
    }

    // Limit size
    if (file.size > 10 * 1024 * 1024) { // 10MB limit for documents
      setError("File is too large. Please upload a document smaller than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      onUpload(base64Data, file.type || 'application/pdf', file.name); // Default to pdf if type missing
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Document</h2>
        <p className="text-gray-500">
          Upload a PDF, DOCX, or Pages document to generate a quiz.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.pages,.doc"
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
          "Add Document"
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
