"use client"

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Note = {
    id: string;
    text: string;
    createdAt: string; // ISO String
}

type NotesState = {
  notes: Note[];
  addNote: (note: Note) => void;
  removeNote: (id: string) => void;
  resetNotes: () => void;
};

export const useNotes = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => {
        set((state) => ({
          notes: [...state.notes, note],
        }));
      },
      removeNote: (id) => {
        set((state) => ({
            notes: state.notes.filter(note => note.id !== id)
        }))
      },
      resetNotes: () => {
        set({ notes: [] });
      }
    }),
    {
      name: 'notes-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
