import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
const queryClient = new QueryClient(); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
          <QueryClientProvider client={queryClient}>
              <App />
          </QueryClientProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
