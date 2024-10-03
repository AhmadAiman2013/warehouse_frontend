import { z } from "zod"

export const InboundFormSchemaCreate = z.object({
    sku: z.string(),
    quantity: z.number(),
    supplier: z.string(),
    status: z.enum(['received', 'pending']),
    name: z.optional(z.string()),
    category: z.optional(z.string()),
    location: z.optional(z.string())
})

export type InboundDataInput = z.infer<typeof InboundFormSchemaCreate>

export type InboundData = InboundDataInput & {
    id: number,
    ref: string,
    date: Date
} 

export const InboundFormSchema = z.object({
    category: z.string(),
    location: z.string(),
    name: z.string()
})


export interface InboundDataReceived{
    id: number,
    ref: string,
    date: Date,
    sku: string,
    quantity: number,
    supplier: string,
    category: string,
    location: string,
    name: string,
    status: 'received' | 'pending'
}