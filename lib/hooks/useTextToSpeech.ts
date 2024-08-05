// hooks/useTextToSpeech.ts
import { useState, useCallback } from 'react';
import { getSpeechFromText, deleteTempFile } from '@/lib/actions/ai-actions';

interface TTSResponse {
  audioURL: string;
  tempFilePath: string;
}

export function useTextToSpeech() {
  const [ttsEnabled, setTTSEnabled] = useState(false);
  const [isPreparingAudio, setIsPreparingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleTTS = useCallback(() => {
    setTTSEnabled((prev) => !prev);
  }, []);

  const playTextToSpeech = useCallback(async (text: string) => {
    if (!ttsEnabled) return;

    setIsPreparingAudio(true);
    try {
      const ttsResponse: TTSResponse = await getSpeechFromText(text);

      const audio = new Audio(ttsResponse.audioURL);
      audio.oncanplaythrough = () => {
        setIsPreparingAudio(false);
        setIsPlaying(true);
        audio.play();
      };

      audio.onended = async () => {
        await deleteTempFile(ttsResponse.tempFilePath);
        setIsPlaying(false);
      };
    } catch (error) {
      console.error("Error preparing audio:", error);
      setIsPreparingAudio(false);
    }
  }, [ttsEnabled]);

  return {
    ttsEnabled,
    isPreparingAudio,
    isPlaying,
    toggleTTS,
    playTextToSpeech
  };
}