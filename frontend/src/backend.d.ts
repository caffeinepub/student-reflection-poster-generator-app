import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Reflection {
    title: string;
    body: string;
    timestamp: Time;
}
export interface PortfolioItem {
    hashtags: Array<string>;
    postTimestamp: Time;
    template: Template;
    reflection: Reflection;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface Template {
    id: bigint;
    previewImage: string;
    name: string;
    description: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    generatePoster(reflection: Reflection, templateId: bigint, hashtags: Array<string>): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFilteredReflections(searchTerm: string): Promise<Array<Reflection>>;
    getLastReflections(count: bigint): Promise<Array<Reflection>>;
    getPortfolio(): Promise<Array<PortfolioItem>>;
    getPortfolioByHashtag(hashtag: string): Promise<Array<PortfolioItem>>;
    getReflection(): Promise<Array<Reflection>>;
    getTemplates(): Promise<Array<Template>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveReflection(reflection: Reflection): Promise<void>;
    updateReflection(reflection: Reflection): Promise<void>;
}
