"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
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
import { IssueFormValues } from "@/data/types";
import { useState } from "react";
import { updateIssueData } from "@/data/mockDataFetch";

const FormSchema = z.object({
  locationName: z
    .string({ required_error: "Sijainti vaaditaan" })
    .min(1, { message: "Sijainti vaaditaan" }),
  priority: z
    .string({
      required_error: "priority vaaditaan",
    })
    .min(1, { message: "priority ei voi olla tyhjä" }),
  problem_description: z
    .string({
      required_error: "Huoltotarpeen kuvaus vaaditaan",
    })
    .min(5, {
      message: "Huoltotarpeen kuvauksen tulee olla vähintään 5 merkkiä pitkä",
    }),
  type: z
    .string({
      required_error: "type vaaditaan",
    })
    .min(1, { message: "type ei voi olla tyhjä" }),
  instruction: z.string(),
  missing_equipments: z.string(),
});

interface IssueFormProps {
  data: IssueFormValues | null;
  locationName: string | null;
  params?: { id?: string };
}

export default function ClientForm({ data, locationName }: IssueFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const issueId = data?.id;
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
  const { reset } = form;

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    setIsEditing(false);
    try {
      await updateIssueData(issueId, formData);
      toast({
        duration: 4000,
        description: "Vikailmoitusta muokattu onnistuneesti",
      });
    } catch (error: FieldErrors | any) {
      toast({
        duration: 4000,
        description: `Virhe vikailmoituksen muokkaamisessa: ${error.message}`,
      });
    }
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

  return (
    <div className="max-w-2xl">
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
                <FormLabel>locationName</FormLabel>
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
                <FormLabel>priority</FormLabel>
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
                <FormLabel>problem_description</FormLabel>
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
                <FormLabel>type</FormLabel>
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
                <FormLabel>instruction</FormLabel>
                <Input
                  placeholder="Ehdotettu huolto-ohje"
                  {...field}
                  disabled={!isEditing}
                />
                <div className="mt-2 tracking-tight md:tracking-normal">
                  Kysy AI ehdotusta huolto-ohjeista
                  <Button
                    type="button"
                    variant={"outline"}
                    className="ml-2"
                    disabled={!isEditing}
                  >
                    Avaa
                    <Bot className="ml-2 h-5 w-5" />
                  </Button>
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
                <FormLabel>missing_equipments</FormLabel>
                <div>
                  <Input
                    placeholder="Tarvittavat varaosat"
                    {...field}
                    disabled={!isEditing}
                  />
                  <div className="mt-2 tracking-tight md:tracking-normal">
                    Kysy AI ehdotusta varaosista{" "}
                    <Button
                      type="button"
                      variant={"outline"}
                      className="ml-2"
                      disabled={!isEditing}
                    >
                      Avaa
                      <Bot className="ml-2 h-5 w-5" />
                    </Button>
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
            <Button type="button" onClick={handleEdit}>
              Muokkaa
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
