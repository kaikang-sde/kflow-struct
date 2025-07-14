import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/base.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// create a global query client instance which can be used in whole app
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}> 
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}> 
        <RouterProvider router={router} /> 
      </SnackbarProvider>
    </QueryClientProvider>
  </StrictMode>
)
