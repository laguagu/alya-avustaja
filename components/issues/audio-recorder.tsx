import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";

export default function AudioRecorder({ onRecordingComplete }: { onRecordingComplete: (audioUrl: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([] as Blob[]);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    
    mediaRecorderRef.current.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      audioChunksRef.current = [];
      onRecordingComplete(audioUrl);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div>
      {isRecording ? (
        <Button className="mt-2" onClick={handleStopRecording}>
          Pysäytä nauhoitus
        </Button>
      ) : (
        <Button className="mt-2" onClick={handleStartRecording}>
          Sanele vian kuvaus
        </Button>
      )}
      {audioURL && (
        <div className="mt-4">
          <audio controls src={audioURL} />
          <a href={audioURL} download="recording.wav">
            Lataa nauhoitus
          </a>
        </div>
      )}
    </div>
  );
}