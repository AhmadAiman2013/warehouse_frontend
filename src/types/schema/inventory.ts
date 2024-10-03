import {  z } from "zod"

export const InventoryFormSchema = z.object({
    sku: z.string(),
    category: z.string(),
    name: z.string(),
    location: z.string(),
    quantity: z.number(),
    supplier: z.string(),
})

export type InventoryDataInput = z.infer<typeof InventoryFormSchema>

export type InventoryData = InventoryDataInput & {
    id: number
}

export const InventoryShipFormSchema = (initialQuantity: number) => z.object({
    quantity: z.number().refine((value) => value <= initialQuantity, {
        message: `Quantity cannot exceed ${initialQuantity}`,
    }),
    destination: z.string()
})

export type InventoryShipdataInput = z.infer<ReturnType<typeof InventoryShipFormSchema>>

export type InventoryShipdata = InventoryShipdataInput & {
    sku: string,
    date: Date,
}

