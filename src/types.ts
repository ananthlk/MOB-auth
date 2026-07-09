/** Shared auth types for Mobius extension and chat */

export type AuthState = "unauthenticated" | "authenticated" | "onboarding";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UserProfile {
  user_id: string;
  tenant_id: string;
  email?: string;
  display_name?: string;
  first_name?: string;
  preferred_name?: string;
  greeting_name: string;
  avatar_url?: string;
  timezone: string;
  locale: string;
  is_onboarded: boolean;
  activities: string[];
  tone: "professional" | "friendly" | "concise";
  greeting_enabled: boolean;
  ai_experience_level?: "beginner" | "regular" | "expert";
  autonomy_routine_tasks?: "automatic" | "confirm_first" | "manual";
  autonomy_sensitive_tasks?: "automatic" | "confirm_first" | "manual";
  org_memberships?: { org_slug: string; display_name: string; roles: string[] }[];
}

export interface UserPreferences {
  preferred_name?: string;
  timezone?: string;
  activities?: string[];
  tone?: "professional" | "friendly" | "concise";
  greeting_enabled?: boolean;
  ai_experience_level?: "beginner" | "regular" | "expert";
  autonomy_routine_tasks?: "automatic" | "confirm_first" | "manual";
  autonomy_sensitive_tasks?: "automatic" | "confirm_first" | "manual";
  /** Free-text org name or canonical slug; server resolves against the master org registry */
  organization?: string;
}
