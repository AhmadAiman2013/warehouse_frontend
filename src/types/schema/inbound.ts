export interface InboundData{
    id: number,
    ref: string,
    date: Date,
    sku: string,
    quantity: number,
    supplier: string,
    status: 'received' | 'pending'
}