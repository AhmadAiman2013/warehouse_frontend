import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosJWT } from "@/lib/axios";
import { InventoryData } from "@/types/schema/inventory";

export const useInventory = () => {
    const queryClient = useQueryClient()

    const {data : inventories, isLoading} = useQuery({
        queryKey: ['inventory'],
        queryFn: async () => {
            try {
                const response = await axiosJWT.get<InventoryData[]>('/inventory')
                return response.data
            } catch(err) {
                console.error({message: 'inbound data failed to retrived', error: err})
            }
        }
    })

    return {
        inventories,
        isLoading
    }
}