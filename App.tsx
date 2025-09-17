
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FileUpload } from './components/FileUpload';
import { VerificationResultCard } from './components/VerificationResult';
import { LoadingSpinner } from './components/LoadingSpinner';
import { verifyCertificate } from './services/geminiService';
import type { VerificationResult } from './types';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a PNG, JPG, or WEBP image.');
        return;
      }
      setError(null);
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleVerification = useCallback(async () => {
    if (!file) {
      setError('Please upload a certificate file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const result = await verifyCertificate(file);
      setVerificationResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setVerificationResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
            {!verificationResult && !isLoading && (
              <FileUpload 
                onFileChange={handleFileChange} 
                previewUrl={previewUrl}
                file={file}
                onVerify={handleVerification}
                onClear={handleReset}
                disabled={isLoading}
              />
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <LoadingSpinner />
                <h2 className="text-xl font-semibold text-slate-700 mt-6">Analyzing Certificate...</h2>
                <p className="text-slate-500 mt-2">The AI is scrutinizing the document for authenticity. Please wait.</p>
              </div>
            )}
            
            {error && (
               <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-700">Verification Failed</h3>
                  <p className="text-red-600 mt-2">{error}</p>
                  <button
                    onClick={handleReset}
                    className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
              </div>
            )}

            {verificationResult && !isLoading && (
              <VerificationResultCard result={verificationResult} onReset={handleReset} previewUrl={previewUrl} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
