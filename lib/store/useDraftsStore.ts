"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type Draft = {
  id: string;
  sablonTipi: string;
  baslik: string;
  veri: Record<string, unknown>;
  olusturmaTarihi: number;
  guncellemeTarihi: number;
};

type DraftsState = {
  taslaklarim: Draft[];
  
  // Taslak yükle/kaydet
  taslakEkle: (sablon: string, baslik: string, veri: Record<string, unknown>) => Draft;
  taslakGuncelle: (id: string, veri: Record<string, unknown>) => void;
  taslakSil: (id: string) => void;
  taslakGetir: (id: string) => Draft | undefined;
  
  // localStorage senkronizasyonu
  localStoragedenYukle: () => void;
  localStorageyeKaydet: () => void;
};

export const useDraftsStore = create<DraftsState>((set, get) => ({
  taslaklarim: [],

  taslakEkle: (sablon, baslik, veri) => {
    const yeniTaslak: Draft = {
      id: uuidv4(),
      sablonTipi: sablon,
      baslik,
      veri,
      olusturmaTarihi: Date.now(),
      guncellemeTarihi: Date.now(),
    };
    set((state) => ({
      taslaklarim: [yeniTaslak, ...state.taslaklarim],
    }));
    get().localStorageyeKaydet();
    return yeniTaslak;
  },

  taslakGuncelle: (id, veri) => {
    set((state) => ({
      taslaklarim: state.taslaklarim.map((t) =>
        t.id === id ? { ...t, veri, guncellemeTarihi: Date.now() } : t
      ),
    }));
    get().localStorageyeKaydet();
  },

  taslakSil: (id) => {
    set((state) => ({
      taslaklarim: state.taslaklarim.filter((t) => t.id !== id),
    }));
    get().localStorageyeKaydet();
  },

  taslakGetir: (id) => {
    return get().taslaklarim.find((t) => t.id === id);
  },

  localStoragedenYukle: () => {
    try {
      const kayit = localStorage.getItem("KolayBelge:taslaklarim");
      if (kayit) {
        set({ taslaklarim: JSON.parse(kayit) });
      }
    } catch {
      // Bozuk veri yok sayılır
    }
  },

  localStorageyeKaydet: () => {
    try {
      const state = get();
      localStorage.setItem("KolayBelge:taslaklarim", JSON.stringify(state.taslaklarim));
    } catch {
      // Kota dolarsa sessiz geç
    }
  },
}));

// Sayfa yüklendiğinde localStorage'dan oku
if (typeof window !== "undefined") {
  useDraftsStore.getState().localStoragedenYukle();
}
