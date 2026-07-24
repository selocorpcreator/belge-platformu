import { create } from "zustand";

type Sekme = "form" | "onizleme";

type UIState = {
  adim: number;
  sekme: Sekme;
  duzenlemeModu: boolean;
  setAdim: (a: number) => void;
  setSekme: (s: Sekme) => void;
  setDuzenlemeModu: (d: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  adim: 0,
  sekme: "form",
  duzenlemeModu: false,
  setAdim: (adim) => set({ adim }),
  setSekme: (sekme) => set({ sekme }),
  setDuzenlemeModu: (duzenlemeModu) => set({ duzenlemeModu }),
}));
