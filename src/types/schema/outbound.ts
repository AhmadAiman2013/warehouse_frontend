export interface OutboundData{
    id: number,
    ref: string,
    date: Date,
    sku: string,
    quantity: number,
    destination: string,
    status: 'shipped'
}