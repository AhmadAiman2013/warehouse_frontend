import { Button } from "@/components/ui/button"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAuth } from "@/hooks/useAuth"

const Dashboard = () => {
  const { logout } = useAuth()
  return (
    <>
    <div>this dashboard</div>
    <Button onClick={logout}>
      Logout
    </Button>
    </>
  )
}

export const Route = createFileRoute('/dashboard')(
    {
    beforeLoad: async ({ context, location }) => {
        if (!context.user?.user_id) {
            throw redirect({
                to: '/',
                search: {
            redirect: location.href,
          },
        })
      }
    },
    component: Dashboard
  },
)

