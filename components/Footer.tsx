
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-8 py-6 border-t border-slate-200">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Authenticity Validator. AI-powered analysis for academic integrity.
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Disclaimer: This tool provides an AI-based assessment and does not constitute a legal verification. Always confirm with the issuing institution for official validation.
        </p>
      </div>
    </footer>
  );
};
