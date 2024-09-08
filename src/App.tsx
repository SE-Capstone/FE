import { Suspense, useState } from 'react';

import { Box, ChakraProvider } from '@chakra-ui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import { GlobalLoading } from './components/elements';
import { GOOGLE_CLIENT_ID } from './configs';
import { AlertDialogProvider } from './contexts';
import { AuthProvider } from './contexts/auth/auth-context';
import { queryClientOptions } from './libs/react-query';
import { AppRouter } from './routes/router';

import theme from '@/themes';

import './App.css';

export default function App() {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <DndProvider backend={HTML5Backend}>
            <ChakraProvider theme={theme}>
              <Suspense fallback={<GlobalLoading isLoading />}>
                <AlertDialogProvider>
                  <AuthProvider>
                    <AppRouter />
                  </AuthProvider>
                </AlertDialogProvider>
                <Box
                  __css={{
                    "& .toaster-text div[role='status']": {
                      fontSize: { base: 'sm' },
                      fontWeight: 'medium',
                    },
                  }}
                >
                  <Toaster toastOptions={{ className: 'toaster-text' }} />
                </Box>
              </Suspense>
            </ChakraProvider>
          </DndProvider>
        </HelmetProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom" buttonPosition="bottom-right" />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
