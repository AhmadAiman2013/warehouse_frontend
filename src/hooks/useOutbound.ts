import { useQuery } from "@tanstack/react-query";
import { axiosJWT } from "@/lib/axios";
import { OutboundData } from "@/types/schema/outbound";

export const useOutbound = () => {
    
    const {data : outbounds, isLoading} = useQuery({
        queryKey: ['outbound'],
        queryFn: async () => {
            try {
                const response = await axiosJWT.get<OutboundData[]>('/outbound')
                return response.data
            } catch(err) {
                console.error({message: 'inbound data failed to retrived', error: err})
            }
        }
    })

    return {
        outbounds,
        isLoading
    }
}