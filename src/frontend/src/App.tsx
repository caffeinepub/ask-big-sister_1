import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import ConnectWallet from './pages/ConnectWallet';
import ProfileSetup from './components/ProfileSetup';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { useGetCallerUserProfile } from './hooks/useQueries';

function Layout() {
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

function AppContent() {
  const { identity, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity && loginStatus === 'success';
  
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  const rootRoute = createRootRoute({
    component: Layout,
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

  const routeTree = rootRoute.addChildren([indexRoute, connectWalletRoute]);

  const router = createRouter({ routeTree });

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppContent />
      <Toaster />
    </ThemeProvider>
  );
}
