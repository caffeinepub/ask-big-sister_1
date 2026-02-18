import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import ConnectWallet from './pages/ConnectWallet';
import GamePage from './pages/GamePage';
import ProfileSetup from './components/ProfileSetup';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { useGetCallerUserProfile } from './hooks/useQueries';

// Create router and route tree at module scope (only once)
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const connectWalletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/connect-wallet',
  component: ConnectWallet,
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game',
  component: GamePage,
});

const routeTree = rootRoute.addChildren([indexRoute, connectWalletRoute, gameRoute]);
const router = createRouter({ routeTree });

function RootLayout() {
  const { isAuthenticated, isInitializing } = useAuth();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  // Show profile setup if authenticated but no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
