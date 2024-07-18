import { z } from "zod";

export const FormSchema = z.object({
  id: z.number().optional(),
  locationName: z
    .string({ required_error: "Sijainti vaaditaan" })
    .min(1, { message: "Sijainti vaaditaan" }),
  priority: z
    .string({
      required_error: "priority vaaditaan",
    })
    .min(1, { message: "Prioriteetti ei voi olla tyhjä" }),
  problem_description: z
    .string({
      required_error: "Huoltotarpeen kuvaus vaaditaan",
    })
    .min(5, {
      message: "Huoltotarpeen kuvauksen tulee olla vähintään 5 merkkiä pitkä",
    }),
  type: z
    .string({
      required_error: "tyyppi vaaditaan",
    })
    .min(1, { message: "Vikatyyppi ei voi olla tyhjä" }),
  instruction: z.string().optional(),
  missing_equipments: z.string().optional(),
});
