import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosJWT } from "@/lib/axios";
import { InboundDataInput, InboundData, InboundDataReceived } from "@/types/schema/inbound";

export const useInbound = () => {
    const queryClient = useQueryClient()

    const {data : inbounds, isLoading} = useQuery({
        queryKey: ['inbound'],
        queryFn: async () => {
            try {
                const response = await axiosJWT.get<InboundData[]>('/inbound/')
                return response.data
            } catch(err) {
                console.error({message: 'inbound data failed to retrived', error: err})
            }
        }
    })

    const {mutateAsync : updateInboundMutation, isPending : isPendingUpdate} = useMutation({
        mutationFn: async (data: InboundDataReceived) => {
            const response = await axiosJWT.put(`/inbound/${data.id}/`, data);
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['inbound']})
            queryClient.invalidateQueries({queryKey:['inventory']})
        }
    })

    const updateInbound = async (data: InboundDataReceived) => {
        try {
            const response = await updateInboundMutation(data)
            return response
        } catch (err) {
            console.error({message: 'inbound data failed toupdated', error: err})
        }
    }

    const {mutateAsync : createInboundMutation, isPending : isPendingCreate} = useMutation({
        mutationFn: async (data: InboundDataInput) => {
            console.log(data)
            const response = await axiosJWT.post('/inbound/', data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['inbound']})
            queryClient.invalidateQueries({queryKey:['inventory']})
        }
    })

    const createInbound = async (data: InboundDataInput) => {
        try {
            const response = await createInboundMutation(data)
            return response
        } catch (err) {
            console.error({message: 'inbound data failed to updated', error: err})
        }
    }

     

    return {
        inbounds,
        isLoading,
        updateInbound,
        isPendingUpdate,
        createInbound,
        isPendingCreate
    }
}