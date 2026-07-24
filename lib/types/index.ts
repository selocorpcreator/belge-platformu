import type { ReactNode } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";
import type { ZodSchema } from "zod";

/**
 * Desteklenen belge türleri
 */
export type DocumentType = "airbnb" | "ihtarname" | "ibraname" | "ticari-anlasmasi";

/**
 * Belge kategorisi tanımı
 */
export interface DocumentCategory {
  id: DocumentType;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  steps: number;
  active: boolean;
}

/**
 * Belge şablonu generic tipi
 */
export interface DocumentTemplate<T extends FieldValues = Record<string, any>> {
  id: DocumentType;
  name: string;
  description: string;
  schema: ZodSchema;
  defaultValues: T;
  
  steps: {
    id: string;
    title: string;
    fields: (keyof T)[];
    icon?: string;
  }[];
  
  clauses?: {
    id: string;
    title: string;
    text: string;
    category?: string;
  }[];
  
  components: {
    form: Record<string, React.ComponentType<any>>;
    preview: React.ComponentType<{ data: T; editMode?: boolean }>;
  };
  
  metadata?: {
    disclaimer?: string;
    category?: string;
  };
}

/**
 * Taslak (Draft) tanımı
 */
export interface Draft {
  id: string;
  type: DocumentType;
  title: string;
  data: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}
