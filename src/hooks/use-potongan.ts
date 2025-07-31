"use client"

import { create } from 'zustand';

type PotonganState = {
  bpjsKesehatanEnabled: boolean;
  setBpjsKesehatanEnabled: (enabled: boolean) => void;
  bpjsKetenagakerjaanEnabled: boolean;
  setBpjsKetenagakerjaanEnabled: (enabled: boolean) => void;
};

export const usePotongan = create<PotonganState>((set) => ({
  bpjsKesehatanEnabled: true,
  setBpjsKesehatanEnabled: (enabled) => set({ bpjsKesehatanEnabled: enabled }),
  bpjsKetenagakerjaanEnabled: false,
  setBpjsKetenagakerjaanEnabled: (enabled) => set({ bpjsKetenagakerjaanEnabled: enabled }),
}));
