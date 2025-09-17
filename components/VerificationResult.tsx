
import React from 'react';
import type { VerificationResult } from '../types';
import { VerificationStatus } from '../types';
import { ShieldCheckIcon, AlertTriangleIcon, ShieldAlertIcon, FileQuestionIcon, RefreshCwIcon, ClipboardListIcon, FlagIcon } from './IconComponents';

interface VerificationResultCardProps {
  result: VerificationResult;
  onReset: () => void;
  previewUrl: string | null;
}

const getStatusTheme = (status: VerificationStatus) => {
  switch (status) {
    case VerificationStatus.AUTHENTIC:
      return {
        Icon: ShieldCheckIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        title: 'Authenticity Verified'
      };
    case VerificationStatus.SUSPICIOUS:
      return {
        Icon: AlertTriangleIcon,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        title: 'Suspicious Document'
      };
    case VerificationStatus.FORGED:
      return {
        Icon: ShieldAlertIcon,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        title: 'High Risk of Forgery'
      };
    default:
      return {
        Icon: FileQuestionIcon,
        color: 'text-slate-600',
        bgColor: 'bg-slate-100',
        borderColor: 'border-slate-200',
        title: 'Unable to Verify'
      };
  }
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="text-md font-semibold text-slate-800">{value || 'N/A'}</p>
  </div>
);

export const VerificationResultCard: React.FC<VerificationResultCardProps> = ({ result, onReset, previewUrl }) => {
  const theme = getStatusTheme(result.status);
  const { details } = result;

  return (
    <div className="animate-fade-in">
        <div className={`p-6 rounded-t-2xl border-b-2 ${theme.bgColor} ${theme.borderColor}`}>
            <div className="flex items-center gap-4">
                <theme.Icon className={`w-10 h-10 ${theme.color}`} />
                <div>
                    <h2 className={`text-2xl font-bold ${theme.color}`}>{theme.title}</h2>
                    <p className="text-slate-600">AI-powered forensic analysis completed.</p>
                </div>
            </div>
        </div>

        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    {previewUrl && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2"><ClipboardListIcon className="w-5 h-5" />Extracted Details</h3>
                            <div className={`space-y-3 p-4 rounded-lg border ${theme.bgColor} ${theme.borderColor}`}>
                                <DetailItem label="Student Name" value={details.studentName} />
                                <DetailItem label="University" value={details.university} />
                                <DetailItem label="Degree / Major" value={details.degree} />
                                <DetailItem label="Graduation Date" value={details.graduationDate} />
                                <DetailItem label="Certificate ID" value={details.certificateId} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-700 mb-3">Analysis Report</h3>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">{result.analysis}</p>

                    {result.redFlags && result.redFlags.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2"><FlagIcon className="w-5 h-5"/>Potential Red Flags</h3>
                            <ul className="space-y-2">
                                {result.redFlags.map((flag, index) => (
                                <li key={index} className="flex items-start gap-2 text-slate-700">
                                    <AlertTriangleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                                    <span>{flag}</span>
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="px-6 pb-6 mt-6 text-center">
            <button
                onClick={onReset}
                className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
                <RefreshCwIcon className="w-5 h-5" />
                Verify Another Document
            </button>
        </div>
    </div>
  );
};
