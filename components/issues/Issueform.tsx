"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { DeviceItemCard, FurnitureInfo, IssueFormValues } from "@/data/types";
import { useState } from "react";
import { closeIssueAction, openIssueAction, postNewIssue } from "@/app/actions";
import { AiInstructionButton } from "../Client-Buttons";
import { FormSchema } from "@/lib/schemas";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

interface IssueFormProps {
  data: IssueFormValues | null;
  locationName: string | null;
  deviceData: DeviceItemCard | null;
  params?: { id?: string };
}

export default function IssueForm({
  data,
  locationName,
  deviceData,
}: IssueFormProps) {
  const router = useRouter();
  const issueId = data?.id;
  const [isEditing, setIsEditing] = useState(false);
  const isCompleted = data?.is_completed ?? false;

  const { execute: executeStatusChange, isExecuting: isChangingStatus } =
    useAction(isCompleted ? openIssueAction : closeIssueAction, {
      onSuccess: ({ data }) => {
        toast({
          variant: "default",
          title: isCompleted
            ? "Vikailmoitus avattu uudelleen!"
            : "Vikailmoitus suljettu!",
          duration: 5000,
          description: data?.message,
        });
        router.refresh();
      },
      onError: ({ error }) => {
        toast({
          variant: "destructive",
          title: "Virhe",
          duration: 5000,
          description: isCompleted
            ? "Vikailmoituksen avaaminen epäonnistui"
            : "Vikailmoituksen sulkeminen epäonnistui",
        });
      },
    });

  const { execute, result, isExecuting } = useAction(postNewIssue, {
    onSuccess: ({ data }) => {
      console.log("onSuccess", data);
      toast({
        variant: "default",
        title: "Vikailmoitus päivitetty! 🎉",
        duration: 5000,
        description: data?.message,
      });
      router.refresh();
    },
    onError: ({ error }) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        title: "Virhe",
        duration: 5000,
        description: "Vikailmoitus ei päivittynyt onnistuneesti",
      });
    },
  });

  const furnitureInfo: FurnitureInfo = {
    name: deviceData?.name || "",
    model: deviceData?.model || "",
    brand: deviceData?.brand || "",
    problem_description: data?.problem_description || "",
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      locationName: locationName ?? "Arabian peruskoulu",
      priority: data?.priority ?? "",
      type: data?.type ?? "",
      problem_description: data?.problem_description ?? "",
      instruction: data?.instruction ?? "",
      missing_equipments: data?.missing_equipments ?? "",
    },
  });

  const { errors } = form.formState;
  const { reset, setValue } = form;

  async function onSubmit() {
    setIsEditing(false);
    const completeFormData = { id: issueId, ...form.getValues() };
    await execute(completeFormData);
    router.refresh();
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    reset({
      locationName: locationName ?? "Arabian peruskoulu",
      priority: data?.priority ?? "",
      type: data?.type ?? "",
      problem_description: data?.problem_description ?? "",
      instruction: data?.instruction ?? "",
      missing_equipments: data?.missing_equipments ?? "",
    });
    setIsEditing(false);
  }

  const updateInstruction = (instruction: string) => {
    setValue("instruction", instruction);
  };

  const handleStatusChange = async () => {
    const numericIssueId = Number(issueId);
    if (issueId) {
      await executeStatusChange({ issueId: numericIssueId });
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <p
          className={`text-lg font-semibold ${
            isCompleted ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCompleted ? "Vikailmoitus on suljettu" : "Vikailmoitus on avoinna"}
        </p>
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
                  disabled={!isEditing}
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
                <Input
                  placeholder="Huoltotarpeen kuvaus"
                  {...field}
                  disabled={!isEditing}
                />
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
                  disabled={!isEditing}
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
                <Input
                  placeholder="Ehdotettu huolto-ohje"
                  {...field}
                  disabled={!isEditing}
                />
                <div className="mt-2 tracking-tight md:tracking-normal flex items-center">
                  Kysy AI:n suositusta kalusteen huollosta
                  <AiInstructionButton
                    isEditing={isEditing}
                    instruction={field.value}
                    updateInstruction={updateInstruction}
                    furnitureInfo={furnitureInfo}
                  />
                </div>
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
                    disabled={!isEditing}
                  />
                  <div className="mt-2 tracking-tight md:tracking-normal flex items-center">
                    {/* Kysy AI ehdotusta varaosista
                    <AiPartsButton
                      isEditing={isEditing}
                      problem_description="Rikki"
                    /> */}
                  </div>
                </div>
                <FormMessage>{errors.missing_equipments?.message}</FormMessage>
              </FormItem>
            )}
          />
          {isEditing ? (
            <div className="flex space-x-4">
              <Button type="submit">Tallenna</Button>
              <Button type="button" variant={"outline"} onClick={handleCancel}>
                Peruuta
              </Button>
            </div>
          ) : (
            <>
              <Button type="button" onClick={handleEdit}>
                Muokkaa
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    className="ml-2"
                    variant={isCompleted ? "default" : "destructive"}
                    disabled={isChangingStatus}
                  >
                    {isCompleted ? "Avaa vikailmoitus" : "Sulje vikailmoitus"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Oletko varma?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {isCompleted
                        ? "Tämä toiminto avaa vikailmoituksen uudelleen. Haluatko jatkaa?"
                        : "Tämä toiminto sulkee vikailmoituksen. Haluatko jatkaa?"}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Peruuta</AlertDialogCancel>
                    <AlertDialogAction onClick={handleStatusChange}>
                      {isCompleted ? "Avaa" : "Sulje"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
