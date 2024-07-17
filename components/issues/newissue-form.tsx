"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { postNewIssue } from "@/app/actions";
import { FormSchema } from "@/lib/schemas";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import AudioRecorder from "./audio-recorder";


export default function NewIssueForm() {
  const router = useRouter();

  const { execute, result, isExecuting } = useAction(postNewIssue, {
    onSuccess: ({ data }) => {
      console.log("onSuccess", data);
      toast({
        variant: "default",
        title: "Vikailmoitus tallennettu! 🎉",
        duration: 5000,
        description: data?.message,
      });
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

  const handleRecordingComplete = (audioUrl: string) => {
    // Voit käyttää tätä funktiota käsittelemään nauhoituksen URL-osoitetta
    // Käytä tähän vercelin aiSDK ja objektin striimausta. 
    // 1. Nauhoita ääni
    // 2. Muuta ääni tekstiksi
    // 3. Näytä modal ikkuna jossa on teksti ja mahdollisuus muokata sitä
    // 4. Lähetä teksti Vercelin aiSDK:lle
    // 5. Vastaanota vastaus striimattuna ja täytä lomake
    console.log("Nauhoitus valmis: ", audioUrl);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-4 p-4 border rounded-md bg-gray-50">
        <h2 className="text-lg font-bold">
          Täydennä vikailmoitus huonekalusta
        </h2>
        <p className="text-sm text-gray-600 ">
          Täytä alla olevat tiedot huonekalun viasta. Voit myös sanella vian
          kuvauksen painamalla alla olevaa nappia. Jolloin tekoäly täydentää
          lomakkeen puolestasi.
        </p>
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      </div>
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
                <FormLabel>Prioriteetti</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isExecuting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Valitse priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Ei kiireellinen">
                      Ei kiireellinen
                    </SelectItem>
                    <SelectItem value="Huomioitava">Huomioitava</SelectItem>
                    <SelectItem value="Kiireelinen">Kiireelinen</SelectItem>
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
                <FormLabel>Huoltotarpeen kuvaus</FormLabel>
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
                <FormLabel>Vikatyyppi</FormLabel>
                <Select
                  disabled={isExecuting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                  placeholder="Ehdotettu huolto-ohje"
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
                  <div className="mt-2 tracking-tight md:tracking-normal flex items-center">
                    Kysy AI ehdotusta varaosista
                    {/* <AiPartsButton
                      isEditing={isEditing}
                      problem_description="Rikki"
                    /> */}
                  </div>
                </div>
                <FormMessage>{errors.missing_equipments?.message}</FormMessage>
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <Button type="submit">Lähetä</Button>
            <Button type="button" variant={"outline"} onClick={handleCancel}>
              Tyhjennä
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
