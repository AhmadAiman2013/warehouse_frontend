import { useMutation } from "@tanstack/react-query";
import { axiosJWT } from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { UserInput } from "@/types/schema/user";
import { useAuthStore } from "./useAuthStore";
import { JWT } from "@/types/schema/jwt";
import { router } from "@/main";

export const useAuth = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const accessToken = useAuthStore((state) => state.accessToken);

  const loginMutation = useMutation({
    mutationFn: async (data: UserInput) => {
      const response = await axiosJWT.post("/token", data);
      return response.data;
    },
  });

  const login = async (data: UserInput) => {
    try {
      const response: { accessToken: string; refreshToken: string } =
        await loginMutation.mutateAsync(data);
        router.navigate({to: '/dashboard'})
      setTokens(response.accessToken, response.refreshToken);
    } catch (err) {
      console.error({ message: "login failed", error: err });
    }
  };

  const registerMutation = useMutation({
    mutationFn: async (data: UserInput) => {
      const response = await axiosJWT.post("/user/register", data);
      return response.data;
    },
  })

  const register = async (data: UserInput) => {
    try {
      const response: {id: number, username: string} = await registerMutation.mutateAsync(data)
      return response
    } catch (err) {
      console.error({ message: "login failed", error: err });
    }
  }

  const verifyToken = () => {

    if (!accessToken) {
      return null;
    }

    try {
      const decodedToken: JWT = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        return undefined;
      }

      return decodedToken
    } catch (err) {
      console.error({ message: "decoding fail", error: err });
      return undefined;
    }
  };

  const user = verifyToken()

  const logout = () => {
    clearTokens()
    router.navigate({to: '/'})
  }

 

  return {
    register,
    login,
    logout,
    user
  };
};

export const useUser = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const verifyToken = () => {

        if (!accessToken) {
          return null;
        }
    
        try {
          const decodedToken: JWT = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;
    
          if (decodedToken.exp < currentTime) {
            return null;
          }
    
          return decodedToken
        } catch (err) {
          console.error({ message: "decoding fail", error: err });
          return null;
        }
      };
    
      const user = verifyToken()
    return user
}
