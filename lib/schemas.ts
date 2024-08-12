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

export const NewIssueFormSchem = z.object({
  id: z.number().optional(),
  priority: z
    .string({
      required_error: "Prioriteetti on pakollinen",
    })
    .min(1, { message: "Prioriteetti ei voi olla tyhjä" }),
  problem_description: z
    .string({
      required_error: "Huoltotarpeen on pakollinen",
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
})

export const repairRequestSchema = z.object({
  priority: z.enum(["Ei kiireellinen", "Huomioitava", "Kiireellinen"]),
  type: z.enum([
    "Puuttuu liukunasta (t)",
    "Kiristysruuvi löysällä",
    "Kiristysruuvi puuttuu",
    "Runko heiluu",
    "Selkänoja heiluu",
    "Istuin heiluu",
    "Materiaali vioittunut",
    "Ilkivalta",
    "Vaatii puhdistuksen",
    "Muu vika",
  ]),
  problem_description: z.string(),
  instruction: z.string(),
  missing_equipments: z.string(),
});
