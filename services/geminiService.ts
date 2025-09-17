
import { GoogleGenAI, Type } from "@google/genai";
import type { VerificationResult } from '../types';
import { VerificationStatus } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const verificationSchema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      enum: Object.values(VerificationStatus),
      description: "The overall verification status of the certificate."
    },
    details: {
      type: Type.OBJECT,
      properties: {
        studentName: { type: Type.STRING, description: "Full name of the student. Return 'N/A' if not found." },
        university: { type: Type.STRING, description: "Name of the issuing university or institution. Return 'N/A' if not found." },
        degree: { type: Type.STRING, description: "The degree or qualification awarded. Return 'N/A' if not found." },
        graduationDate: { type: Type.STRING, description: "Date of graduation or issuance. Return 'N/A' if not found." },
        certificateId: { type: Type.STRING, description: "Unique certificate or serial number. Return 'N/A' if not found." }
      },
       required: ["studentName", "university", "degree", "graduationDate", "certificateId"],
    },
    analysis: {
      type: Type.STRING,
      description: "A detailed, professional analysis of the document's authenticity, explaining the reasoning behind the status verdict. Cover aspects like layout, fonts, seals, and signatures."
    },
    redFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of specific potential issues or inconsistencies found, such as 'Inconsistent font usage' or 'Blurry university seal'. Return an empty array if no issues are found."
    }
  },
  required: ["status", "details", "analysis", "redFlags"],
};

export const verifyCertificate = async (file: File): Promise<VerificationResult> => {
  try {
    const imagePart = await fileToGenerativePart(file);

    const prompt = `You are an expert academic document fraud investigator with years of experience in forensic analysis. Your task is to meticulously analyze the provided university certificate image.

    Instructions:
    1.  **Extract Key Information**: Carefully extract the student's name, university name, degree title, graduation date, and any unique certificate ID. If a field is not present, return 'N/A'.
    2.  **Forensic Analysis**: Scrutinize the document for any signs of forgery or tampering. Pay close attention to:
        -   **Typography**: Inconsistent fonts, sizes, or spacing. Misspellings or grammatical errors.
        -   **Alignment**: Misaligned text blocks, logos, or signatures.
        -   **Seals & Logos**: Blurry, pixelated, or digitally manipulated university seals or logos.
        -   **Signatures**: Unnatural-looking or digitally inserted signatures.
        -   **Layout & Formatting**: Unprofessional layout, unusual margins, or inconsistent formatting compared to standard academic certificates.
    3.  **Verdict**: Based on your analysis, provide a verification status: 'Authentic' if it appears completely legitimate, 'Suspicious' if there are minor inconsistencies that warrant further checks, 'Likely Forged' if there are clear and multiple signs of tampering, or 'Unable to Verify' if the image quality is too low for a proper analysis.
    4.  **Reporting**: Generate a detailed report in the specified JSON format, outlining your findings, the extracted details, and a list of specific red flags.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          imagePart,
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: verificationSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as VerificationResult;

    // Validate the result structure
    if (!result.status || !result.details || !result.analysis) {
        throw new Error("Incomplete verification data received from AI.");
    }

    return result;

  } catch (error) {
    console.error("Error verifying certificate with Gemini API:", error);
    throw new Error("Failed to communicate with the AI verification service. The service may be temporarily unavailable.");
  }
};
