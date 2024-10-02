import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Dashboard = () => {
  const { logout } = useAuth();
  return (
    <>
      <div className="flex justify-center items-center space-x-4 mt-5">
        <p className="text-4xl font-medium">Warehouse Data</p>
        <Button
          onClick={() => {
            logout();
            toast.success("Logout successful");
          }}
          className="ml-4"
        >
          Logout
        </Button>
      </div>
      <div>
        <h1>he</h1>
      </div>
    </>
  );
};

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context, location }) => {
    if (!context.user?.user_id) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Dashboard,
});
