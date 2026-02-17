import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { 
  useGetCurrentWalletAddress, 
  useLinkWalletAddress, 
  useUpdateWalletAddress, 
  useUnlinkWalletAddress 
} from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, AlertCircle, CheckCircle2, Info, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ConnectWallet() {
  const navigate = useNavigate();
  const { identity, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity && loginStatus === 'success';

  const { data: currentWalletAddress, isLoading: loadingWallet } = useGetCurrentWalletAddress();
  const linkWallet = useLinkWalletAddress();
  const updateWallet = useUpdateWalletAddress();
  const unlinkWallet = useUnlinkWalletAddress();

  const [walletInput, setWalletInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (currentWalletAddress) {
      setWalletInput(currentWalletAddress);
    }
  }, [currentWalletAddress]);

  const validateWalletAddress = (address: string): boolean => {
    setValidationError('');

    if (!address || address.trim() === '') {
      setValidationError('Wallet address cannot be empty');
      return false;
    }

    if (address.length !== 66) {
      setValidationError('Wallet address must be 66 characters long (including 0x prefix)');
      return false;
    }

    if (!address.startsWith('0x')) {
      setValidationError('Wallet address must start with 0x');
      return false;
    }

    const hexPart = address.slice(2);
    const validHexRegex = /^[0-9a-fA-F]+$/;
    if (!validHexRegex.test(hexPart)) {
      setValidationError('Wallet address must contain only valid hexadecimal characters after 0x');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateWalletAddress(walletInput)) {
      return;
    }

    try {
      if (currentWalletAddress) {
        await updateWallet.mutateAsync(walletInput);
      } else {
        await linkWallet.mutateAsync(walletInput);
      }
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleRemove = async () => {
    try {
      await unlinkWallet.mutateAsync();
      setWalletInput('');
      setShowRemoveDialog(false);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const isLoading = linkWallet.isPending || updateWallet.isPending || unlinkWallet.isPending;
  const hasChanges = walletInput !== (currentWalletAddress || '');

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate({ to: '/' })}
          className="mb-6"
        >
          ← Back to Home
        </Button>

        <Card className="border-2">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Connect Wallet</CardTitle>
                <CardDescription>Link a wallet address to your profile</CardDescription>
              </div>
            </div>

            <Alert className="border-primary/20 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                This feature stores a wallet address in your profile. It does not connect to a live wallet, 
                send transactions, or access your funds. You're simply linking an address for reference.
              </AlertDescription>
            </Alert>
          </CardHeader>

          <CardContent className="space-y-6">
            {loadingWallet ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    type="text"
                    placeholder="0x..."
                    value={walletInput}
                    onChange={(e) => {
                      setWalletInput(e.target.value);
                      setValidationError('');
                    }}
                    disabled={isLoading}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a valid Ethereum-style wallet address (66 characters, starting with 0x)
                  </p>
                </div>

                {validationError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}

                {currentWalletAddress && !validationError && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-300">
                      Wallet address is currently linked to your profile
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading || !hasChanges || !walletInput.trim()}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : currentWalletAddress ? (
                      'Update Address'
                    ) : (
                      'Link Address'
                    )}
                  </Button>

                  {currentWalletAddress && (
                    <Button
                      variant="destructive"
                      onClick={() => setShowRemoveDialog(true)}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Wallet Address?</AlertDialogTitle>
              <AlertDialogDescription>
                This will unlink the wallet address from your profile. You can always add it back later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemove}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove Address
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
