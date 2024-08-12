import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, CirclePause } from "lucide-react";
import { useAudioRecording } from "@/lib/hooks/useAudioRecording";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcriptionText: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
}) => {
  const {
    recording,
    isProcessingAudio,
    handleStartRecording,
    handleStopRecording,
  } = useAudioRecording();

  const handleStopAndComplete = async () => {
    const result = await handleStopRecording();
    if (result && result.audioBlob && result.transcriptionText) {
      onRecordingComplete(result.audioBlob, result.transcriptionText);
    }
  };

  return (
    <div className="flex justify-center">
      {recording ? (
        <Button
          className="mt-2"
          onClick={handleStopAndComplete}
          disabled={isProcessingAudio}
        >
          <CirclePause className="h-5 w-5 mr-2" />
          Pysäytä nauhoitus
        </Button>
      ) : (
        <Button
          className="mt-2"
          onClick={handleStartRecording}
          disabled={isProcessingAudio}
        >
          <Mic className="h-5 w-5 mr-2" />
          Aloita nauhoitus
        </Button>
      )}
    </div>
  );
};
export default AudioRecorder;
