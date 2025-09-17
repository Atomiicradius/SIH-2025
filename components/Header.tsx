
import React from 'react';
import { ShieldCheckIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Authenticity Validator
          </h1>
        </div>
      </div>
    </header>
  );
};
