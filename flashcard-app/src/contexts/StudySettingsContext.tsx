import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CardDirection = 'english-to-georgian' | 'georgian-to-english';
export type StudyMode = 'flip' | 'type';

interface StudySettings {
  cardDirection: CardDirection;
  studyMode: StudyMode;
  autoPlayAudio: boolean;
  showPronunciation: boolean;
}

interface StudySettingsContextType {
  settings: StudySettings;
  setCardDirection: (direction: CardDirection) => void;
  setStudyMode: (mode: StudyMode) => void;
  setAutoPlayAudio: (enabled: boolean) => void;
  setShowPronunciation: (enabled: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings: StudySettings = {
  cardDirection: 'english-to-georgian',
  studyMode: 'flip',
  autoPlayAudio: true,
  showPronunciation: true,
};

const StudySettingsContext = createContext<StudySettingsContextType | undefined>(undefined);

export function useStudySettings(): StudySettingsContextType {
  const context = useContext(StudySettingsContext);
  if (context === undefined) {
    throw new Error('useStudySettings must be used within a StudySettingsProvider');
  }
  return context;
}

interface StudySettingsProviderProps {
  children: ReactNode;
}

export function StudySettingsProvider({ children }: StudySettingsProviderProps): React.JSX.Element {
  const [settings, setSettings] = useState<StudySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('studySettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Error loading study settings:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('studySettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving study settings:', error);
    }
  }, [settings]);

  const setCardDirection = (direction: CardDirection) => {
    setSettings(prev => ({ ...prev, cardDirection: direction }));
  };

  const setStudyMode = (mode: StudyMode) => {
    setSettings(prev => ({ ...prev, studyMode: mode }));
  };

  const setAutoPlayAudio = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, autoPlayAudio: enabled }));
  };

  const setShowPronunciation = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, showPronunciation: enabled }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <StudySettingsContext.Provider
      value={{
        settings,
        setCardDirection,
        setStudyMode,
        setAutoPlayAudio,
        setShowPronunciation,
        resetSettings,
      }}
    >
      {children}
    </StudySettingsContext.Provider>
  );
}