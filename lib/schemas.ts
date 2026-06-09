import { z } from "zod";

export const speciesOptions = ["Dog", "Cat", "Bird", "Reptile", "Amphibian", "Small Mammal", "Exotic"] as const;

export const petProfileSchema = z.object({
  species: z.enum(speciesOptions),
  name: z.string().min(1, "Name is required"),
  breed: z.string().optional(),
  colorMarkings: z.string().optional(),
  dateOfBirth: z.string().optional(),
  sex: z.enum(["Female", "Male", "Unknown"]).default("Unknown"),
  spayedNeutered: z.boolean().default(false),
  microchipNumber: z.string().regex(/^\d{15}$/, "Microchip must be 15 digits").optional().or(z.literal("")),
  speciesDetail: z.string().optional(),
  weight: z.coerce.number().positive().optional(),
  notes: z.string().optional()
});

export const manualRecordSchema = z.object({
  date: z.string().min(1, "Date is required"),
  category: z.enum(["Vaccine", "Surgery", "Diagnostic", "Medication", "Visit", "Note"]),
  itemName: z.string().min(2, "Item name is required"),
  provider: z.string().optional(),
  notes: z.string().optional()
});
