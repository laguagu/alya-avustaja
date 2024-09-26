"use client";

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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DeviceItemCard, FurnitureInfo, IssueFormValues } from "@/data/types";
import {
  closeIssueAction,
  openIssueAction,
  updateIssueAction,
} from "@/lib/actions/actions";
import { FormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useOptimisticAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { AiInstructionButton } from "../Client-Buttons";

interface IssueFormProps {
  data: IssueFormValues;
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
  const [isPending, startTransition] = useTransition();
  const [textareaRows, setTextareaRows] = useState(2);
  const [instructionContent, setInstructionContent] = useState(
    data?.instruction || "",
  );
  const [isCompleted, setIsCompleted] = useState(data?.is_completed);
  const issueId = data?.id;

  const furnitureInfo = useMemo<FurnitureInfo>(
    () => ({
      name: deviceData?.name || "",
      model: deviceData?.model || "",
      brand: deviceData?.brand || "",
      problem_description: data?.problem_description || "",
    }),
    [deviceData, data],
  );

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

  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting },
  } = form;

  const {
    execute: executeStatusChange,
    isExecuting: isChangingStatus,
    optimisticState,
  } = useOptimisticAction(
    data.is_completed ? openIssueAction : closeIssueAction,
    {
      currentState: data,
      updateFn: (state, input) => ({
        ...state,
        is_completed: !state.is_completed,
      }),
      onSuccess: (result) => {
        if (result.data?.is_completed !== undefined) {
          toast.success(
            result.data.is_completed
              ? "Vikailmoitus suljettu!"
              : "Vikailmoitus avattu uudelleen!",
            { duration: 5000 },
          );
          setIsCompleted(result.data.is_completed);
          startTransition(() => {
            router.refresh();
          });
        }
      },
      onError: () => {
        toast.error(
          data.is_completed
            ? "Vikailmoituksen avaaminen epäonnistui"
            : "Vikailmoituksen sulkeminen epäonnistui",
          { duration: 5000 },
        );
      },
    },
  );

  const { execute: executeUpdate, isExecuting: isUpdating } = useAction(
    updateIssueAction,
    {
      onSuccess: () => {
        toast.success("Vikailmoitus päivitetty! 🎉", { duration: 5000 });
        startTransition(() => {
          router.refresh();
        });
      },
      onError: () => {
        toast.error("Vikailmoitus ei päivittynyt onnistuneesti", {
          duration: 5000,
        });
      },
    },
  );

  const onSubmit = useCallback(
    async (formData: z.infer<typeof FormSchema>) => {
      const completeFormData = { id: issueId, ...formData };
      await executeUpdate(completeFormData);
    },
    [executeUpdate, issueId],
  );

  const handleStatusChange = useCallback(() => {
    executeStatusChange({ issueId: Number(data.id) });
  }, [executeStatusChange, data.id]);

  useEffect(() => {
    const lineCount = instructionContent.split("\n").length;
    setTextareaRows(Math.min(Math.max(2, lineCount), 10));
  }, [instructionContent]);

  return (
    <Card className="w-full max-w-2xl mb-8">
      <CardHeader>
        <CardTitle
          className={`text-lg ${isCompleted ? "text-green-600" : "text-red-600"}`}
        >
          {isCompleted ? "Vikailmoitus on suljettu" : "Vikailmoitus on avoinna"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="locationName"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sijainti</FormLabel>
                    <Input {...field} disabled />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioriteetti</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                        <SelectItem value="Kiireelinen">Kiireelinen</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Vian prioriteetti</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Controller
              name="problem_description"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Huoltotarpeen kuvaus</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vikatyyppi</FormLabel>
                  <Select
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              name="instruction"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tekoälyn huolto-ohje ehdotus</FormLabel>
                  <Textarea
                    {...field}
                    value={instructionContent}
                    onChange={(e) => {
                      setInstructionContent(e.target.value);
                      field.onChange(e);
                    }}
                    rows={textareaRows}
                  />
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Kysy AI:n suositusta kalusteen huollosta
                    </span>
                    <AiInstructionButton
                      isEditing={true}
                      instruction={field.value}
                      updateInstruction={(newInstruction) => {
                        setInstructionContent(newInstruction);
                        field.onChange(newInstruction);
                      }}
                      furnitureInfo={furnitureInfo}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              name="missing_equipments"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puuttuvat tarvikkeet</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting || isUpdating || isPending}
                variant="default"
                className="w-full sm:w-auto text-sm px-3 py-2"
              >
                {isUpdating || isPending
                  ? "Tallennetaan..."
                  : "Tallenna muutokset"}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant={isCompleted ? "outline" : "destructive"}
                    disabled={isChangingStatus || isUpdating || isPending}
                    className="w-full sm:w-auto text-sm px-3 py-2"
                  >
                    {isCompleted ? "Avaa uudelleen" : "Sulje vikailmoitus"}
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
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
