import { useState, useCallback, useRef } from "react";
import { getWhisperTranscription } from "@/lib/actions/ai-actions";

export function useAudioRecording() {
  const [recording, setRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const handleStartRecording = useCallback(() => {
    audioChunksRef.current = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        mediaRecorder.start();
        setRecording(true);
      })
      .catch((error) => {
        console.error("Error starting recording:", error);
      });
  }, []);

  const handleStopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) {
      console.error("MediaRecorder not initialized");
      return;
    }
    mediaRecorderRef.current.stop();
    setRecording(false);
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      if (audioBlob.size > 25415) {
        setIsProcessingAudio(true);
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
        const transcriptionText = await getWhisperTranscription(formData);
        setIsProcessingAudio(false);
        return transcriptionText;
      } else {
        console.log("Audio too short, not processing");
        return null;
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      setIsProcessingAudio(false);
      return null;
    } finally {
      audioChunksRef.current = [];
    }
  }, []);

  return {
    recording,
    isProcessingAudio,
    handleStartRecording,
    handleStopRecording,
  };
}
