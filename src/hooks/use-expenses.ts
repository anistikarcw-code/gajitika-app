"use client"

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Expense = {
    id: string;
    amount: number;
    description: string;
    date: string; // ISO String
}

type ExpensesState = {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  resetExpenses: () => void;
};

export const useExpenses = create<ExpensesState>()(
  persist(
    (set) => ({
      expenses: [],
      addExpense: (expense) => {
        set((state) => ({
          expenses: [...state.expenses, expense],
        }));
      },
      removeExpense: (id) => {
        set((state) => ({
            expenses: state.expenses.filter(expense => expense.id !== id)
        }))
      },
      resetExpenses: () => {
        set({ expenses: [] });
      }
    }),
    {
      name: 'expenses-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
