
export enum VerificationStatus {
  AUTHENTIC = 'Authentic',
  SUSPICIOUS = 'Suspicious',
  FORGED = 'Likely Forged',
  UNABLE_TO_VERIFY = 'Unable to Verify'
}

export interface ExtractedDetails {
  studentName: string;
  university: string;
  degree: string;
  graduationDate: string;
  certificateId: string;
}

export interface VerificationResult {
  status: VerificationStatus;
  details: ExtractedDetails;
  analysis: string;
  redFlags: string[];
}
