'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type CheckInState = {
  checkIns: string[]; // Array of date strings 'YYYY-MM-DD'
  addCheckIn: (date: string) => void;
  resetCheckIns: () => void;
};

export const useCheckIn = create<CheckInState>()(
  persist(
    (set, get) => ({
      checkIns: [],
      addCheckIn: (date) => {
        const { checkIns } = get();
        if (!checkIns.includes(date)) {
          set({ checkIns: [...checkIns, date] });
        }
      },
      resetCheckIns: () => {
        set({ checkIns: [] });
      }
    }),
    {
      name: 'checkin-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
