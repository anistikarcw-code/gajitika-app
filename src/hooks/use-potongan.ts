"use client"

import { create } from 'zustand';

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

export const usePotongan = create<PotonganState>((set) => ({
  ...initialState,
  setBpjsKesehatanEnabled: (enabled) => set({ bpjsKesehatanEnabled: enabled }),
  setBpjsKetenagakerjaanEnabled: (enabled) => set({ bpjsKetenagakerjaanEnabled: enabled }),
  resetPotongan: () => set(initialState),
}));
