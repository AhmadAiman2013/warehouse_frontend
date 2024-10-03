import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            setTokens: (accessToken, refreshToken) => set(
                {
                    accessToken,
                    refreshToken
                }
            ),
            clearTokens: () => set({accessToken: null, refreshToken: null})
        }),
        {
            name: 'auth-storage'
        }
    )
)

interface SearchState {
    search: string | ""
    setSearch: (search: string) => void
    clearSearch: () => void
}

export const useSearchStore = create<SearchState>()(
    (set) => ({
        search: "",
        setSearch: (search) => set({search}),
        clearSearch: () => set({search: ""})
    })
)