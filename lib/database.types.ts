export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          onboarding_completed: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          onboarding_completed?: boolean;
        };
        Relationships: [];
      };
      pets: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          species: Database["public"]["Enums"]["pet_species"];
          breed: string | null;
          species_detail: string | null;
          color_markings: string | null;
          date_of_birth: string | null;
          sex: "Female" | "Male" | "Unknown" | null;
          spayed_neutered: boolean | null;
          microchip_number: string | null;
          weight: number | null;
          care_notes: string | null;
          primary_photo_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          species: Database["public"]["Enums"]["pet_species"];
          breed?: string | null;
          species_detail?: string | null;
          color_markings?: string | null;
          date_of_birth?: string | null;
          sex?: "Female" | "Male" | "Unknown" | null;
          spayed_neutered?: boolean | null;
          microchip_number?: string | null;
          weight?: number | null;
          care_notes?: string | null;
          primary_photo_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pets"]["Insert"]>;
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          owner_id: string;
          pet_id: string | null;
          file_name: string;
          storage_path: string;
          mime_type: string;
          status: Database["public"]["Enums"]["document_status"];
          extracted_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          pet_id?: string | null;
          file_name: string;
          storage_path: string;
          mime_type: string;
          status?: Database["public"]["Enums"]["document_status"];
          extracted_json?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
        Relationships: [];
      };
      timeline_records: {
        Row: {
          id: string;
          owner_id: string;
          pet_id: string;
          document_id: string | null;
          category: Database["public"]["Enums"]["timeline_category"];
          title: string;
          occurred_on: string;
          next_due_on: string | null;
          provider_name: string | null;
          manufacturer: string | null;
          batch_number: string | null;
          technician: string | null;
          dosage: string | null;
          frequency: string | null;
          qualitative_results: string | null;
          values_json: Json;
          notes: string | null;
          dedupe_key: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          pet_id: string;
          document_id?: string | null;
          category: Database["public"]["Enums"]["timeline_category"];
          title: string;
          occurred_on: string;
          next_due_on?: string | null;
          provider_name?: string | null;
          manufacturer?: string | null;
          batch_number?: string | null;
          technician?: string | null;
          dosage?: string | null;
          frequency?: string | null;
          qualitative_results?: string | null;
          values_json?: Json;
          notes?: string | null;
          dedupe_key?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["timeline_records"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      pet_species: "Dog" | "Cat" | "Bird" | "Reptile" | "Amphibian" | "Small Mammal" | "Exotic";
      timeline_category: "vaccine" | "surgery" | "diagnostic" | "medication" | "visit" | "note";
      document_status: "uploaded" | "processing" | "needs_review" | "complete" | "failed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
