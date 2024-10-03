import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosJWT } from "@/lib/axios";
import { InventoryData, InventoryDataInput, InventoryShipdataInput } from "@/types/schema/inventory";
import { useSearchStore } from "./useAuthStore";


export const useInventory = () => {
    const queryClient = useQueryClient()
    const search = useSearchStore((state) => state.search)
    const setSearch = useSearchStore((state) => state.setSearch)
    const clearSearch = useSearchStore((state) => state.clearSearch)
    
    
    const { data: inventories, isLoading: isLoadingInventories } = useQuery({
        queryKey: ['inventory', search], 
        queryFn: async () => {
            try {
                const response = await axiosJWT.get<InventoryData[]>(`/inventory/list/?search=${search}/`);
                console.log(response.data)
                return response.data;
            } catch (err) {
                console.error({ message: 'Filtered inventory data failed to retrieve', error: err });
                throw err; 
            }
        },
    });

   
    const {mutateAsync : createInventoryMutation, isPending : isPendingCreate} = useMutation({
        mutationFn: async (data: InventoryDataInput) => {
            const response = await axiosJWT.post('/inventory/', data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['inbound']})
            queryClient.invalidateQueries({queryKey:['inventory']})
        }
    })

    const createInventory = async (data: InventoryDataInput) => {
        try {
            const response = await createInventoryMutation(data)
            return response
        } catch (err) {
            console.error({message: 'inventory data failed to create', error: err})
        }
    }
    const {mutateAsync: deleteInventoryMutation, isPending : isPendingDelete } = useMutation({
        mutationFn: async (id : number) => await axiosJWT.delete(`/inventory/${id}/`), 
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['inventory']})
            queryClient.invalidateQueries({queryKey:['inbound']})
        }
    })

    const deleteInventory = async (id : number) => {
        try {
            await deleteInventoryMutation(id)
        } catch (err) {
            console.error({message: 'inventory data failed to delete', error: err})
        }
    }
    const {mutateAsync: updateInventoryMutation, isPending: isPendingUpdate} = useMutation({
        mutationFn: async (data : InventoryData) => {
            console.log(data)
            const response = await axiosJWT.put(`/inventory/${data.id}/`, data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['inventory']})
        }
    })

    const updateInventory = async (data : InventoryData) => {
        try {
            const response = await updateInventoryMutation(data)
            return response
        } catch (err) {
            console.error({message: 'inventory data failed to update', error: err})
        }

    }

    const {mutateAsync : shipInventoryMutation, isPending : isPendingShip} = useMutation({
        mutationFn: async (data: InventoryShipdataInput) => {
            const response = await axiosJWT.post('/outbound/', data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['outbound']})
            queryClient.invalidateQueries({queryKey:['inventory']})
        }

    })

    const shipInventory = async (data: InventoryShipdataInput) => {
        try {
            const response = await shipInventoryMutation(data)
            return response
        } catch (err) {
            console.error({message: 'inventory data failed to ship', error: err})
        }
    }

    return {
        inventories,
        isLoadingInventories,
        createInventory,
        isPendingCreate,
        deleteInventory,
        isPendingDelete,
        shipInventory,
        isPendingShip,
        updateInventory,
        isPendingUpdate,
        setSearch,
        clearSearch
    }
}