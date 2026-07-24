"use client";

import { create } from "zustand";
import type { Draft, DocumentType } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

interface DocumentState {
  drafts: Draft[];
  currentStep: number;
  
  addDraft: (draft: Omit<Draft, "id" | "createdAt" | "updatedAt">) => Draft;
  updateDraft: (id: string, data: Record<string, any>) => void;
  deleteDraft: (id: string) => void;
  getDraft: (id: string) => Draft | undefined;
  
  setStep: (step: number) => void;
  
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  drafts: [],
  currentStep: 0,

  addDraft: (draft) => {
    const newDraft: Draft = {
      ...draft,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => ({ drafts: [newDraft, ...state.drafts] }));
    get().saveToStorage();
    return newDraft;
  },

  updateDraft: (id, data) => {
    set((state) => ({
      drafts: state.drafts.map((d) =>
        d.id === id ? { ...d, data, updatedAt: Date.now() } : d
      ),
    }));
    get().saveToStorage();
  },

  deleteDraft: (id) => {
    set((state) => ({ drafts: state.drafts.filter((d) => d.id !== id) }));
    get().saveToStorage();
  },

  getDraft: (id) => get().drafts.find((d) => d.id === id),

  setStep: (step) => set({ currentStep: step }),

  loadFromStorage: () => {
    try {
      const saved = localStorage.getItem("kolaybelgeal:drafts");
      if (saved) {
        set({ drafts: JSON.parse(saved) });
      }
    } catch (e) {
      console.warn("Taslaklar yüklenemedi:", e);
    }
  },

  saveToStorage: () => {
    try {
      const { drafts } = get();
      localStorage.setItem("kolaybelgeal:drafts", JSON.stringify(drafts));
    } catch (e) {
      console.warn("Taslaklar kaydedilemedi:", e);
    }
  },
}));

// Sayfa yüklendiğinde taslakları yükle
if (typeof window !== "undefined") {
  useDocumentStore.getState().loadFromStorage();
}
