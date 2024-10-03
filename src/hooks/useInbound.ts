import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosJWT } from "@/lib/axios";
import { InboundData } from "@/types/schema/inbound";

export const useInbound = () => {
    const queryClient = useQueryClient()

    const {data : inbounds, isLoading} = useQuery({
        queryKey: ['inbound'],
        queryFn: async () => {
            try {
                const response = await axiosJWT.get<InboundData[]>('/inbound')
                return response.data
            } catch(err) {
                console.error({message: 'inbound data failed to retrived', error: err})
            }
        }
    })

    return {
        inbounds,
        isLoading
    }
}