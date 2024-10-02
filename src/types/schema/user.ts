import { z } from "zod"

export const FormSchema = z.object({
    username: z.string(),
    password: z.string()
})

export type UserInput = z.infer<typeof FormSchema>


