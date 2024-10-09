"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitFeedback } from "@/lib/actions/actions";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useState } from "react";

export default function FeedbackForm({
  issueId,
  instruction,
}: {
  issueId: string;
  instruction: string;
}) {
  const [isPositive, setIsPositive] = useState<boolean | null>(null);
  const [feedbackDetails, setFeedbackDetails] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const { execute, status } = useAction(submitFeedback, {
    onSuccess: () => {
      setFeedbackMessage("Kiitos palautteestasi!");
      setIsPositive(null);
      setFeedbackDetails("");
    },
    onError: (error) => {
      setFeedbackMessage("Virhe palautteen lähetyksessä. Yritä uudelleen.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPositive === null) return;

    execute({
      issueId: parseInt(issueId),
      instruction,
      isPositive,
      feedbackDetails,
    });
  };

  const handleFeedbackButtonClick = useCallback((value: boolean) => {
    setIsPositive(value);
    setFeedbackMessage(null); // Tyhjennetään palauteviesti
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Oliko tämä ohje hyödyllinen?
        </h3>
        <div className="flex space-x-4">
          <Button
            type="button"
            onClick={() => handleFeedbackButtonClick(true)}
            variant={isPositive === true ? "default" : "outline"}
          >
            👍 Kyllä
          </Button>
          <Button
            type="button"
            onClick={() => handleFeedbackButtonClick(false)}
            variant={isPositive === false ? "default" : "outline"}
          >
            👎 Ei
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Lisäpalaute (vapaaehtoinen):
        </h3>
        <Textarea
          value={feedbackDetails}
          onChange={(e) => setFeedbackDetails(e.target.value)}
          rows={4}
        />
      </div>
      <Button
        type="submit"
        disabled={isPositive === null || status === "executing"}
      >
        {status === "executing" ? "Lähetetään..." : "Lähetä Palaute"}
      </Button>
      {feedbackMessage && (
        <p
          className={
            status === "hasSucceeded" ? "text-green-600" : "text-red-600"
          }
        >
          {feedbackMessage}
        </p>
      )}
    </form>
  );
}
