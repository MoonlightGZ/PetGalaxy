export type ExtractionProvider = "openai" | "anthropic" | "gemini";

export type ExtractedMedicalRecord = {
  petName?: string;
  species?: string;
  breed?: string;
  dateOfBirth?: string;
  microchipNumber?: string;
  records: Array<{
    category: "vaccine" | "surgery" | "medication" | "diagnostic" | "visit" | "note";
    title: string;
    date: string;
    nextDueDate?: string;
    provider?: string;
    confidence: number;
    dedupeKey: string;
    notes?: string;
  }>;
};

export interface DocumentExtractionAdapter {
  provider: ExtractionProvider;
  extractMedicalRecords(file: File): Promise<ExtractedMedicalRecord>;
}

export const extractionStages = [
  "Scanning Layout...",
  "Extracting Key Dates...",
  "Detecting Pet Information...",
  "Validating Records...",
  "Updating Medical Timeline..."
];

export function createExtractionAdapter(provider: ExtractionProvider): DocumentExtractionAdapter {
  return {
    provider,
    async extractMedicalRecords(file) {
      return {
        records: [
          {
            category: "visit",
            title: file.name.replace(/\.[^.]+$/, ""),
            date: new Date().toISOString().slice(0, 10),
            confidence: 0.72,
            dedupeKey: `${provider}:${file.name}:${file.size}`,
            notes: "AI extraction adapter placeholder ready for secure server-side provider integration."
          }
        ]
      };
    }
  };
}
