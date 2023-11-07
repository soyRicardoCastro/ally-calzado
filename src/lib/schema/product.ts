import { z } from "zod"

export const defaultProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  image: z.string().url().optional(),
})

export type DefaultProductSchema = z.infer<typeof defaultProductSchema>