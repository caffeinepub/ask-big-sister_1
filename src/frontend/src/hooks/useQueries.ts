import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCurrentWalletAddress() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['currentWalletAddress'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurrentWalletAddress();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useLinkWalletAddress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (walletAddress: string) => {
      if (!actor) throw new Error('Actor not available');
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (walletAddress: string) => {
      if (!actor) throw new Error('Actor not available');
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
