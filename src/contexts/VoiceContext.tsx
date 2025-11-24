import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VoiceContextType {
  isVoiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  speak: (text: string) => void;
  isSupported: boolean;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const savedVoiceState = localStorage.getItem('voiceEnabled');
    if (savedVoiceState !== null) {
      setIsVoiceEnabled(JSON.parse(savedVoiceState));
    }

    // Check if browser supports speech synthesis
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);
  }, []);

  // Persist to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('voiceEnabled', JSON.stringify(isVoiceEnabled));
  }, [isVoiceEnabled]);

  /**
   * Speaks the given text if voice is enabled
   * Handles browser support and voice selection
   */
  const speak = (text: string): void => {
    if (!isVoiceEnabled || !isSupported || !('speechSynthesis' in window)) {
      return;
    }

    try {
      // Cancel any currently playing audio to prevent overlap
      window.speechSynthesis.cancel();

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to select a preferred voice (Google or Siri)
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find Google or Siri voice
        let selectedVoice = voices.find(
          (voice) => voice.name.includes('Google') || voice.name.includes('Siri')
        );

        // Fall back to first English voice
        if (!selectedVoice) {
          selectedVoice = voices.find((voice) => voice.lang.startsWith('en'));
        }

        // Fall back to first available voice
        if (!selectedVoice) {
          selectedVoice = voices[0];
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      // Speak
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in speech synthesis:', error);
    }
  };

  const handleSetVoiceEnabled = (enabled: boolean): void => {
    setIsVoiceEnabled(enabled);
  };

  return (
    <VoiceContext.Provider
      value={{
        isVoiceEnabled,
        setVoiceEnabled: handleSetVoiceEnabled,
        speak,
        isSupported,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

/**
 * Hook to access voice context
 * Usage: const { speak, isVoiceEnabled, setVoiceEnabled } = useVoice();
 */
export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
