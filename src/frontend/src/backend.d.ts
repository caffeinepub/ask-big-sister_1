import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    walletAddress?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearUserProfile(): Promise<void>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentWalletAddress(): Promise<string | null>;
    getProfile(user: Principal): Promise<UserProfile>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWalletAddress(user: Principal): Promise<string | null>;
    isCallerAdmin(): Promise<boolean>;
    linkWalletAddress(walletAddress: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    unlinkWalletAddress(): Promise<void>;
    updateUserProfile(name: string): Promise<void>;
    updateWalletAddress(walletAddress: string): Promise<void>;
}
