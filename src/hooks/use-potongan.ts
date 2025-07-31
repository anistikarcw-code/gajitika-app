"use client"

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type PotonganState = {
  bpjsKesehatanEnabled: boolean;
  setBpjsKesehatanEnabled: (enabled: boolean) => void;
  bpjsKetenagakerjaanEnabled: boolean;
  setBpjsKetenagakerjaanEnabled: (enabled: boolean) => void;
  resetPotongan: () => void;
};

const initialState = {
    bpjsKesehatanEnabled: true,
    bpjsKetenagakerjaanEnabled: false,
}

export const usePotongan = create<PotonganState>()(
  persist(
    (set) => ({
      ...initialState,
      setBpjsKesehatanEnabled: (enabled) => set({ bpjsKesehatanEnabled: enabled }),
      setBpjsKetenagakerjaanEnabled: (enabled) => set({ bpjsKetenagakerjaanEnabled: enabled }),
      resetPotongan: () => set(initialState),
    }),
    {
      name: 'potongan-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
