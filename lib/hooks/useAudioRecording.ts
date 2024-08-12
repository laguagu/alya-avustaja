import { useState, useCallback, useRef } from "react";
import { getWhisperTranscription } from "@/lib/actions/ai-actions";
import toast from "react-hot-toast";

export function useAudioRecording() {
  const [recording, setRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = useCallback(() => {
    audioChunksRef.current = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
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
        toast.error("Äänityksen aloitus epäonnistui. Yritä uudelleen.");
      });
  }, []);

  const handleStopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) {
      console.error("MediaRecorder not initialized");
      return null;
    }
    mediaRecorderRef.current.stop();
    setRecording(false);

    return new Promise<{ audioBlob: Blob; transcriptionText: string } | null>(
      (resolve) => {
        mediaRecorderRef.current!.onstop = async () => {
          try {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm;codecs=opus",
            });

            if (audioBlob.size > 25415) {
              setIsProcessingAudio(true);
              const formData = new FormData();
              formData.append("file", audioBlob, "audio.webm");
              const transcriptionText = await getWhisperTranscription(formData);
              setIsProcessingAudio(false);
              resolve({ audioBlob, transcriptionText });
            } else {
              console.log("Audio too short, not processing");
              toast.error("Ääniviesti on liian lyhyt. Yritä uudelleen.", {
                duration: 3000,
                position: "bottom-center",
              });
              resolve(null);
            }
          } catch (error) {
            console.error("Error processing audio:", error);
            setIsProcessingAudio(false);
            toast.error("Virhe äänen käsittelyssä. Yritä uudelleen.", {
              duration: 3000,
              position: "bottom-center",
            });
            resolve(null);
          } finally {
            audioChunksRef.current = [];
          }
        };
      },
    );
  }, []);

  return {
    recording,
    isProcessingAudio,
    handleStartRecording,
    handleStopRecording,
  };
}
