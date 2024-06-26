import { z } from "zod";

export const FormSchema = z.object({
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