'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type CheckInData = {
  checkInTime: string; // ISO string
  checkOutTime: string | null; // ISO string or null
};

type CheckInState = {
  checkIns: Record<string, CheckInData>; // Key is 'YYYY-MM-DD'
  addCheckIn: (date: string, time: string) => void;
  addCheckOut: (date: string, time: string) => void;
  resetCheckIns: () => void;
};

export const useCheckIn = create<CheckInState>()(
  persist(
    (set, get) => ({
      checkIns: {},
      addCheckIn: (date, time) => {
        set((state) => ({
          checkIns: {
            ...state.checkIns,
            [date]: { checkInTime: time, checkOutTime: null },
          },
        }));
      },
      addCheckOut: (date, time) => {
        set((state) => {
          if (!state.checkIns[date]) return {}; // Should not happen
          return {
            checkIns: {
              ...state.checkIns,
              [date]: {
                ...state.checkIns[date],
                checkOutTime: time,
              },
            },
          };
        });
      },
      resetCheckIns: () => {
        set({ checkIns: {} });
      }
    }),
    {
      name: 'checkin-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);