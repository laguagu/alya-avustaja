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
import { postNewIssueAction } from "@/lib/actions";
import { FormSchema } from "@/lib/schemas";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import AudioRecorder from "./audio-recorder";
import { getWhisperTranscription } from "@/lib/ai-actions";
import { useEffect, useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { processAudioTranscription } from "@/lib/ai-actions";
import ModalSpinner from "./modal-spinner";

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
      console.log("onSuccess", data);
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
      console.log("error", error);
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
    console.log("Nauhoitus valmis: ", audioBlob);
    // 1. Nauhoita ääni
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");
    // 2. Muuta ääni tekstiksi
    try {
      const text = await getWhisperTranscription(formData);
      console.log("Transcription: ", text); // Logataan teksti heti kun se saadaan
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
    <div className="max-w-2xl pb-2 md:pb-10 ">
      <div className="mb-4 p-4 border rounded-md bg-gray-50">
        <h2 className="text-lg font-bold">
          Täydennä vikailmoitus huonekalusta AI:n avulla
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Voit joko sanella vian kuvauksen tai kirjoittaa sen itse.
        </p>

        {isProcessing && <ModalSpinner />}
        <div className="flex space-x-2 mb-2">
          <Button
            onClick={() => setInputMethod("audio")}
            variant={inputMethod === "audio" ? "default" : "outline"}
          >
            Sanele
          </Button>
          <Button
            onClick={() => setInputMethod("text")}
            variant={inputMethod === "text" ? "default" : "outline"}
          >
            Kirjoita
          </Button>
        </div>
        {inputMethod === "audio" ? (
          <AudioRecorder
            onRecordingComplete={(audioBlob) => {
              // Käsittele äänitys ja avaa Dialog
              handleRecordingComplete(audioBlob);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <>
            <Textarea
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
              placeholder="Kirjoita vian kuvaus tähän..."
              rows={4}
            />
            <Button
              onClick={() => handleDescriptionSubmit(manualDescription)}
              className="mt-2"
              disabled={isProcessing || manualDescription.trim().length === 0}
            >
              {isProcessing ? "Käsitellään..." : "Lähetä kuvaus"}
            </Button>
          </>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent aria-describedby="dialog-description">
            <DialogHeader>
              <DialogTitle>Tarkista sanelemasi kuvaus</DialogTitle>
              <DialogDescription id="dialog-description">
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
                <Button onClick={() => setIsModalOpen(false)}>Peruuta</Button>
                <Button
                  onClick={() => handleDescriptionSubmit(transcription)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Käsitellään..." : "Vahvista ja täytä lomake"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-sm text-red-500 mb-2">
        * Pakolliset kentät on merkitty tähdellä
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="locationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sijainti</FormLabel>
                <Input placeholder="Sijainti" {...field} disabled={true} />
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
                    <SelectItem value="Huomioitava">Huomioitava</SelectItem>
                    <SelectItem value="Kiireellinen">Kiireellinen</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Vian priority </FormDescription>
                <FormMessage>{errors.priority?.message}</FormMessage>
              </FormItem>
            )}
          />
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
                <p className="text-sm text-muted-foreground">
                  Vian kuvaus on tärkeä, jotta huoltohenkilöstö osaa
                  valmistautua oikein huoltoon.
                </p>
                <FormMessage>{errors.problem_description?.message}</FormMessage>
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
                    <SelectItem value="Runko heiluu">Runko heiluu</SelectItem>
                    <SelectItem value="Selkänoja heiluu">
                      Selkänoja heiluu
                    </SelectItem>
                    <SelectItem value="Istuin heiluu">Istuin heiluu</SelectItem>
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
                  placeholder="Älyä avustajan huolto-ohje ehdotus"
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
                <div>
                  <Input
                    placeholder="Mahdollisesti tarvittavat varaosat"
                    {...field}
                    disabled={isExecuting}
                  />
                </div>
                <FormMessage>{errors.missing_equipments?.message}</FormMessage>
              </FormItem>
            )}
          />

          <div className="flex space-x-4">
            <Button type="submit" disabled={isExecuting || isProcessing}>
              Lähetä
            </Button>
            <Button
              type="button"
              variant={"outline"}
              onClick={handleCancel}
              disabled={isProcessing}
            >
              Tyhjennä
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
