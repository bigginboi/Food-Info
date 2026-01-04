import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserPreferences, UserGoal, TonePreference } from '@/types/food-label';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updateGoal: (goal: UserGoal) => void;
  updateTonePreference: (tone: TonePreference) => void;
  updateFlags: (flags: Partial<Omit<UserPreferences, 'goal' | 'tonePreference'>>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  goal: 'normal-consumer',
  tonePreference: 'balanced',
  flagHighSugar: false,
  flagArtificialAdditives: false,
  flagPreservatives: false,
  flagAllergens: false,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  const updateGoal = (goal: UserGoal) => {
    setPreferences((prev) => ({ ...prev, goal }));
  };

  const updateTonePreference = (tonePreference: TonePreference) => {
    setPreferences((prev) => ({ ...prev, tonePreference }));
  };

  const updateFlags = (flags: Partial<Omit<UserPreferences, 'goal' | 'tonePreference'>>) => {
    setPreferences((prev) => ({ ...prev, ...flags }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <UserPreferencesContext.Provider
      value={{ preferences, updateGoal, updateTonePreference, updateFlags, resetPreferences }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}
