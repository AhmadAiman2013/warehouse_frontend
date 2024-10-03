import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { useUser} from "@/hooks/useAuth";

interface MyRouterContext {
  user: ReturnType<typeof useUser> 
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
