import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Wallet, User, LogOut, Gamepad2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  
  const { data: userProfile } = useGetCallerUserProfile();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button 
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/assets/generated/ask-big-sister-logo.dim_512x512.png" 
            alt="Ask Big Sister" 
            className="w-10 h-10 rounded-lg"
          />
          <span className="font-bold text-xl hidden sm:inline">Ask Big Sister</span>
        </button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/game' })}
            className="gap-2"
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden sm:inline">Play Game</span>
          </Button>

          {isAuthenticated && userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{userProfile.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: '/connect-wallet' })}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAuth}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleAuth}
              disabled={disabled}
              className="gap-2"
            >
              {disabled ? 'Logging in...' : 'Login'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
