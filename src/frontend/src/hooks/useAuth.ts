import { useInternetIdentity } from './useInternetIdentity';

/**
 * Centralized authentication state hook.
 * Returns true if the user has a non-anonymous identity (authenticated).
 * This works correctly after page reloads when identity is restored from storage.
 */
export function useAuth() {
  const { identity, isInitializing } = useInternetIdentity();
  
  // User is authenticated if they have an identity that is not anonymous
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  
  return {
    isAuthenticated,
    isInitializing,
    identity,
  };
}
