"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { IssueFormValues } from "@/data/vikailmoitusMockData";

const FormSchema = z.object({
  location_id: z.union([
    z.string().min(1, { message: "Sijainti vaaditaan" }),
    z.number().min(1, { message: "Sijainti vaaditaan" }),
  ]),
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
  used_equipments: z.string(),
});

export default function ClientForm({ data }: { data: IssueFormValues | null }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location_id: data?.location_id ?? "Arabian peruskoulu",
      priority: data?.priority ?? "",
      type: data?.type ?? "",
      problem_description: data?.problem_description ?? "",
      instruction: data?.instruction ?? "",
      used_equipments: data?.used_equipments ?? "",
    },
  });

  const { errors } = form.formState;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="location_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>location_id</FormLabel>
                <Input placeholder="Sijainti" {...field} disabled={true} />
                <FormMessage>{errors.location_id?.message}</FormMessage>
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
                <Input placeholder="Huoltotarpeen kuvaus" {...field} />
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
                <Input placeholder="Ehdotettu huolto-ohje" {...field} />
                <div className="mt-2 tracking-tight md:tracking-normal">
                  Kysy tekoälyltä ehdotusta huolto-ohjeista{" "}
                  <Button type="button" variant={"outline"}>
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
            name="used_equipments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>used_equipments</FormLabel>
                <div>
                  <Input placeholder="Tarvittavat varaosat" {...field} />
                  <div className="mt-2 tracking-tight md:tracking-normal">
                    Kysy tekoälyltä ehdotusta varaosista{" "}
                    <Button type="button" variant={"outline"}>
                      Avaa
                      <Bot className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <FormMessage>{errors.used_equipments?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit">Tallenna</Button>
        </form>
      </Form>
    </div>
  );
}
