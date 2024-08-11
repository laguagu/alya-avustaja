"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { postNewIssueAction } from "@/lib/actions/actions";
import { FormSchema } from "@/lib/schemas";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import AudioRecorder from "./audio-recorder";
import { getWhisperTranscription } from "@/lib/actions/ai-actions";
import { useEffect, useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { processAudioTranscription } from "@/lib/actions/ai-actions";
import ModalSpinner from "./modal-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Type, Loader2, Send } from "lucide-react";

export default function NewIssueForm() {
  const router = useRouter();
  const [transcription, setTranscription] = useState("");
  const [inputMethod, setInputMethod] = useState<"audio" | "text">("audio");
  const [manualDescription, setManualDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<
    Partial<z.infer<typeof FormSchema>>
  >({});

  const { execute, result, isExecuting } = useAction(postNewIssueAction, {
    onSuccess: ({ data }) => {
      toast({
        variant: "default",
        title: "Vikailmoitus tallennettu! 🎉",
        duration: 5000,
        description: data?.message,
      });
      router.refresh();
      form.reset();
      setAiSuggestions({});
    },
    onError: ({ error }) => {
      toast({
        variant: "destructive",
        title: "Virhe",
        duration: 5000,
        description: "Vikailmoitus ei tallentunut onnistuneesti",
      });
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      locationName: "Arabian peruskoulu",
      priority: "",
      type: "",
      problem_description: "",
      instruction: "",
      missing_equipments: "",
    },
  });

  const { errors } = form.formState;
  const { reset } = form;

  async function onSubmit() {
    await execute(form.getValues());
    router.refresh();
    form.reset(form.getValues());
  }

  function handleCancel() {
    reset({
      locationName: "Arabian peruskoulu",
      priority: "",
      type: "",
      problem_description: "",
      instruction: "",
      missing_equipments: "",
    });
  }

  useEffect(() => {
    if (Object.keys(aiSuggestions).length > 0) {
      Object.entries(aiSuggestions).forEach(([key, value]) => {
        if (value) {
          form.setValue(key as keyof z.infer<typeof FormSchema>, value);
        }
      });
    }
  }, [aiSuggestions, form]);

  const handleDescriptionSubmit = async (description: string) => {
    setIsProcessing(true);
    setIsModalOpen(false);
    const { object } = await processAudioTranscription(description);

    for await (const partialObject of readStreamableValue(object)) {
      if (partialObject) {
        setAiSuggestions((prevSuggestions) => ({
          ...prevSuggestions,
          ...partialObject,
        }));
      }
    }

    setIsProcessing(false);
    setInputMethod("audio");
    setManualDescription("");
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    // 1. Nauhoita ääni
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");
    // 2. Muuta ääni tekstiksi
    try {
      const text = await getWhisperTranscription(formData);
      setTranscription(text);
      setIsModalOpen(true);
      // Avaa modali jossa on teksti ja mahdollisuus muokata sitä
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
    // 3. Näytä Dialog ikkuna jossa on teksti ja mahdollisuus muokata sitä
    // 4. Lähetä teksti Vercelin aiSDK:lle
    // 5. Vastaanota vastaus striimattuna ja täytä lomake
  };

  return (
    <div className="spaxe-y-8">
      <Card className="w-full max-w-2xl mb-8 ">
        <CardHeader>
          <CardTitle>Uusi vikailmoitus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 sm:p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">
              AI-avusteinen vikailmoitus
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Voit joko sanella vian kuvauksen tai kirjoittaa sen itse. AI
              auttaa täyttämään lomakkeen tietojen perusteella.
            </p>

            {isProcessing && <ModalSpinner />}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
              <Button
                onClick={() => setInputMethod("audio")}
                variant={inputMethod === "audio" ? "default" : "outline"}
                className="w-full sm:w-auto"
              >
                <Mic className="mr-2 h-4 w-4" />
                Sanele
              </Button>
              <Button
                onClick={() => setInputMethod("text")}
                variant={inputMethod === "text" ? "default" : "outline"}
                className="w-full sm:w-auto"
              >
                <Type className="mr-2 h-4 w-4" />
                Kirjoita
              </Button>
            </div>
            {inputMethod === "audio" ? (
              <div className="bg-white p-3 sm:p-4 rounded-md shadow-inner">
                <AudioRecorder
                  onRecordingComplete={(audioBlob) => {
                    handleRecordingComplete(audioBlob);
                    setIsModalOpen(true);
                  }}
                />
              </div>
            ) : (
              <div className="bg-white p-3 sm:p-4 rounded-md shadow-inner">
                <Textarea
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  placeholder="Kirjoita vian kuvaus tähän..."
                  rows={4}
                  className="mb-3 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
                <Button
                  onClick={() => handleDescriptionSubmit(manualDescription)}
                  disabled={
                    isProcessing || manualDescription.trim().length === 0
                  }
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Käsitellään...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Lähetä kuvaus
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tarkista sanelemasi kuvaus</DialogTitle>
                <DialogDescription>
                  Tarkista sanelemasi vian kuvaus ja tee tarvittavat muutokset
                  ennen lomakkeen täyttämistä.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                rows={5}
              />
              <DialogFooter>
                <div className="flex justify-between w-full">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                  >
                    Peruuta
                  </Button>
                  <Button
                    onClick={() => handleDescriptionSubmit(transcription)}
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Käsitellään..."
                      : "Vahvista ja täytä lomake"}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <p className="text-sm text-red-500 mb-4">
            * Pakolliset kentät on merkitty tähdellä
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="locationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sijainti</FormLabel>
                      <Input
                        placeholder="Sijainti"
                        {...field}
                        disabled={true}
                      />
                      <FormMessage>{errors.locationName?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioriteetti*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isExecuting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Valitse prioriteetti" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ei kiireellinen">
                            Ei kiireellinen
                          </SelectItem>
                          <SelectItem value="Huomioitava">
                            Huomioitava
                          </SelectItem>
                          <SelectItem value="Kiireellinen">
                            Kiireellinen
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Vian prioriteetti</FormDescription>
                      <FormMessage>{errors.priority?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="problem_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Huoltotarpeen kuvaus*</FormLabel>
                    <Textarea
                      placeholder="Huoltotarpeen kuvaus"
                      {...field}
                      disabled={isExecuting}
                    />
                    <FormDescription>
                      Vian kuvaus on tärkeä, jotta huoltohenkilöstö osaa
                      valmistautua oikein huoltoon.
                    </FormDescription>
                    <FormMessage>
                      {errors.problem_description?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vikatyyppi*</FormLabel>
                    <Select
                      disabled={isExecuting}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Valitse vikatyyppi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Puuttuu liukunasta (t)">
                          Puuttuu liukunasta (t)
                        </SelectItem>
                        <SelectItem value="Kiristysruuvi löysällä">
                          Kiristysruuvi löysällä
                        </SelectItem>
                        <SelectItem value="Kiristysruuvi puuttuu">
                          Kiristysruuvi puuttuu
                        </SelectItem>
                        <SelectItem value="Runko heiluu">
                          Runko heiluu
                        </SelectItem>
                        <SelectItem value="Selkänoja heiluu">
                          Selkänoja heiluu
                        </SelectItem>
                        <SelectItem value="Istuin heiluu">
                          Istuin heiluu
                        </SelectItem>
                        <SelectItem value="Materiaali vioittunut">
                          Materiaali vioittunut
                        </SelectItem>
                        <SelectItem value="Ilkivalta">Ilkivalta</SelectItem>
                        <SelectItem value="Vaatii puhdistuksen">
                          Vaatii puhdistuksen
                        </SelectItem>
                        <SelectItem value="Muu vika">Muu vika</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>{errors.type?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instruction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tekoälyn huolto-ohje ehdotus</FormLabel>
                    <Textarea
                      placeholder="Tekoälyn huolto-ohje ehdotus"
                      {...field}
                      disabled={isExecuting}
                    />
                    <FormMessage>{errors.instruction?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="missing_equipments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puuttuvat tarvikkeet</FormLabel>
                    <Input
                      placeholder="Mahdollisesti tarvittavat varaosat"
                      {...field}
                      disabled={isExecuting}
                    />
                    <FormMessage>
                      {errors.missing_equipments?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button type="submit" disabled={isExecuting || isProcessing}>
                  Lähetä
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isProcessing}
                >
                  Tyhjennä
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
