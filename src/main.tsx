import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import "./index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUser } from './hooks/useAuth';
import { Toaster } from "@/components/ui/sonner"


const queryClient = new QueryClient()



// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const router = createRouter({ 
  routeTree,
  context: {
    user: undefined!
  }
 })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}



// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  function App() {
    const user  = useUser()
    return (
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} context={{ user }} />
          <Toaster />
        </QueryClientProvider>
      </StrictMode>
    )
  }

  root.render(<App />)
}