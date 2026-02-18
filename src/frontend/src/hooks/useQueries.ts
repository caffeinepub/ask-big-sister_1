import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useAuth } from './useAuth';
import type { UserProfile } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAuthenticated } = useAuth();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (error: any) {
        // Handle authorization errors gracefully (treat as no profile)
        if (error.message?.includes('Unauthorized') || error.message?.includes('trap')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && isAuthenticated && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor || !isAuthenticated) throw new Error('Not authenticated');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCurrentWalletAddress() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAuthenticated } = useAuth();

  return useQuery<string | null>({
    queryKey: ['currentWalletAddress'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCurrentWalletAddress();
      } catch (error: any) {
        // Handle authorization errors gracefully
        if (error.message?.includes('Unauthorized') || error.message?.includes('trap')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });
}

export function useLinkWalletAddress() {
  const { actor } = useActor();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (walletAddress: string) => {
      if (!actor || !isAuthenticated) throw new Error('Not authenticated');
      return actor.linkWalletAddress(walletAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentWalletAddress'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Wallet address linked successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to link wallet address');
    },
  });
}

export function useUpdateWalletAddress() {
  const { actor } = useActor();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (walletAddress: string) => {
      if (!actor || !isAuthenticated) throw new Error('Not authenticated');
      return actor.updateWalletAddress(walletAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentWalletAddress'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Wallet address updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update wallet address');
    },
  });
}

export function useUnlinkWalletAddress() {
  const { actor } = useActor();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor || !isAuthenticated) throw new Error('Not authenticated');
      return actor.unlinkWalletAddress();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentWalletAddress'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Wallet address removed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove wallet address');
    },
  });
}
