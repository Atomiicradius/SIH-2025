
import React, { useRef } from 'react';
import { UploadCloudIcon, CheckCircleIcon, XCircleIcon } from './IconComponents';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  previewUrl: string | null;
  file: File | null;
  onVerify: () => void;
  onClear: () => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, previewUrl, file, onVerify, onClear, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
    event.target.value = '';
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      <div className="w-full lg:w-1/2">
        <div 
          className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 h-80 flex flex-col items-center justify-center"
          onClick={handleButtonClick}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileSelect}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            disabled={disabled}
          />
          {previewUrl ? (
            <img src={previewUrl} alt="Certificate Preview" className="max-w-full max-h-full object-contain rounded-lg" />
          ) : (
            <div className="flex flex-col items-center text-slate-500">
              <UploadCloudIcon className="w-16 h-16 text-slate-400" />
              <p className="mt-4 text-lg font-semibold">Click to upload a certificate</p>
              <p className="text-sm text-slate-400">PNG, JPG, or WEBP</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-slate-800">Verify Certificate Authenticity</h2>
        <p className="text-slate-600 mt-2 mb-6">Upload an image of the academic certificate. Our AI will perform a detailed forensic analysis to detect potential signs of forgery.</p>
        
        {file ? (
          <div className="space-y-4">
            <div className="bg-slate-100 p-3 rounded-lg flex items-center justify-between">
                <span className="font-medium text-slate-700 truncate pr-4">{file.name}</span>
                <button onClick={onClear} disabled={disabled}>
                    <XCircleIcon className="w-6 h-6 text-slate-400 hover:text-red-500 transition-colors"/>
                </button>
            </div>
            <button
              onClick={onVerify}
              disabled={disabled}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <CheckCircleIcon className="w-5 h-5"/>
              Verify Now
            </button>
          </div>
        ) : (
           <button
            onClick={handleButtonClick}
            disabled={disabled}
            className="w-full bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors disabled:bg-slate-400"
           >
            Select File to Begin
           </button>
        )}
      </div>
    </div>
  );
};
