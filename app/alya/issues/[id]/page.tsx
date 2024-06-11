"use client";

import Link from "next/link";
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
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email("Invalid email address"),
  prioriteetti: z
    .string({
      required_error: "Prioriteetti vaaditaan",
    })
    .min(1, { message: "Prioriteetti ei voi olla tyhjä" }),
  huoltotarpeen_kuvaus: z
    .string({
      required_error: "Huoltotarpeen kuvaus vaaditaan",
    })
    .min(5, {
      message: "Huoltotarpeen kuvauksen tulee olla vähintään 5 merkkiä pitkä",
    }),
  vikatyyppi: z
    .string({
      required_error: "Vikatyyppi vaaditaan",
    })
    .min(1, { message: "Vikatyyppi ei voi olla tyhjä" }),
  ehdotettu_huolto_ohje: z
    .string({
      required_error: "Ehdotettu huolto-ohje vaaditaan",
    })
    .min(1, { message: "Ehdotettu huolto-ohje ei voi olla tyhjä" }),
});

export default function Page({ params }: { params?: { id?: string } }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      prioriteetti: "",
      huoltotarpeen_kuvaus: "",
      vikatyyppi: "",
      ehdotettu_huolto_ohje: "",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage>{errors.email?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prioriteetti"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prioriteetti</FormLabel>
              <Input placeholder="Prioriteetti" {...field} />
              <FormMessage>{errors.prioriteetti?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="huoltotarpeen_kuvaus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Huoltotarpeen kuvaus</FormLabel>
              <Input placeholder="Huoltotarpeen kuvaus" {...field} />
              <FormMessage>{errors.huoltotarpeen_kuvaus?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vikatyyppi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vikatyyppi</FormLabel>
              <Input placeholder="Vikatyyppi" {...field} />
              <FormMessage>{errors.vikatyyppi?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ehdotettu_huolto_ohje"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ehdotettu huolto-ohje</FormLabel>
              <Input placeholder="Ehdotettu huolto-ohje" {...field} />
              <FormMessage>{errors.ehdotettu_huolto_ohje?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
