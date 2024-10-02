import axios from 'axios'
import { useAuthStore } from '@/hooks/useAuthStore'
import { router } from '@/main'

export const axiosJWT = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`
})

axiosJWT.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosJWT.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const refreshToken = useAuthStore.getState().refreshToken

        if (error.response?.status === 401 && refreshToken) {
            try {
                const { data } = await axios.post('/token/refresh', {
                    refresh_token: refreshToken
                })

                const newAccessToken = data.access_token;
                useAuthStore.getState().setTokens(newAccessToken, refreshToken)

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return axiosJWT(originalRequest)
            } catch(refreshTokenError) {
                useAuthStore.getState().clearTokens();
                router.navigate({ to: '/' });
                return Promise.reject(refreshTokenError);
            }
        }

        if (error.response?.status === 401) {
            useAuthStore.getState().clearTokens();
            router.navigate({ to: '/'})
        }

        return Promise.reject(error)
    }
)