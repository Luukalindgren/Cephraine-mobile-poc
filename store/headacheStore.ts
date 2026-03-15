import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import type { HeadacheLog, HeadacheType, PainLocation, Trigger } from '../types';

interface DraftEntry {
  severity: number;
  type: HeadacheType;
  painLocations: PainLocation[];
  durationMinutes: number;
  notes: string;
  triggers: Trigger[];
}

interface HeadacheState {
  logs: HeadacheLog[];
  draft: DraftEntry;

  updateDraft: (partial: Partial<DraftEntry>) => void;
  togglePainLocation: (region: PainLocation['region'], intensity?: number) => void;
  updatePainIntensity: (region: PainLocation['region'], intensity: number) => void;
  toggleTrigger: (trigger: Trigger) => void;
  saveDraft: () => HeadacheLog;
  resetDraft: () => void;
  deleteLog: (id: string) => void;
  getLogsByDateRange: (start: string, end: string) => HeadacheLog[];
}

const defaultDraft: DraftEntry = {
  severity: 5,
  type: 'tension',
  painLocations: [],
  durationMinutes: 60,
  notes: '',
  triggers: [],
};

export const useHeadacheStore = create<HeadacheState>()(
  persist(
    (set, get) => ({
      logs: [],
      draft: { ...defaultDraft },

      updateDraft: (partial) =>
        set((state) => ({
          draft: { ...state.draft, ...partial },
        })),

      togglePainLocation: (region, intensity = 5) =>
        set((state) => {
          const existing = state.draft.painLocations.find(
            (p) => p.region === region
          );
          if (existing) {
            return {
              draft: {
                ...state.draft,
                painLocations: state.draft.painLocations.filter(
                  (p) => p.region !== region
                ),
              },
            };
          }
          return {
            draft: {
              ...state.draft,
              painLocations: [
                ...state.draft.painLocations,
                { region, intensity },
              ],
            },
          };
        }),

      updatePainIntensity: (region, intensity) =>
        set((state) => ({
          draft: {
            ...state.draft,
            painLocations: state.draft.painLocations.map((p) =>
              p.region === region ? { ...p, intensity } : p
            ),
          },
        })),

      toggleTrigger: (trigger) =>
        set((state) => {
          const exists = state.draft.triggers.includes(trigger);
          return {
            draft: {
              ...state.draft,
              triggers: exists
                ? state.draft.triggers.filter((t) => t !== trigger)
                : [...state.draft.triggers, trigger],
            },
          };
        }),

      saveDraft: () => {
        const state = get();
        const newLog: HeadacheLog = {
          id: uuidv4(),
          date: new Date().toISOString().split('T')[0],
          ...state.draft,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          logs: [newLog, ...s.logs],
          draft: { ...defaultDraft },
        }));
        return newLog;
      },

      resetDraft: () => set({ draft: { ...defaultDraft } }),

      deleteLog: (id) =>
        set((state) => ({
          logs: state.logs.filter((l) => l.id !== id),
        })),

      getLogsByDateRange: (start, end) => {
        return get().logs.filter((l) => l.date >= start && l.date <= end);
      },
    }),
    {
      name: 'cephraine-headache-logs',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ logs: state.logs }),
    }
  )
);
