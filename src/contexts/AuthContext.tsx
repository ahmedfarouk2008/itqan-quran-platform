import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

// ==============================================
// Auth Context - إدارة حالة المستخدم مع Supabase
// Using Username instead of Email
// ==============================================

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signUp: (data: SignUpData) => Promise<{ error: Error | null }>;
    signIn: (username: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
    completeOnboarding: (goals: string[], level: string) => Promise<{ error: Error | null }>;
}

interface SignUpData {
    name: string;
    username: string;
    password: string;
    role: 'student' | 'teacher';
    phone?: string;
}

// Helper: Convert username to internal email format
const usernameToEmail = (username: string): string => {
    return `${username.toLowerCase()}@itqan.local`;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user profile from database
    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return null;
            }

            return data as Profile;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    };

    // Initialize auth state
    useEffect(() => {
        // Get initial session
        const initAuth = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();

                if (initialSession) {
                    setSession(initialSession);
                    setUser(initialSession.user);
                    const userProfile = await fetchProfile(initialSession.user.id);
                    setProfile(userProfile);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                console.log('Auth state changed:', event);

                setSession(newSession);
                setUser(newSession?.user ?? null);

                if (newSession?.user) {
                    const userProfile = await fetchProfile(newSession.user.id);
                    setProfile(userProfile);
                } else {
                    setProfile(null);
                }

                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Sign up new user with username
    const signUp = async (data: SignUpData): Promise<{ error: Error | null }> => {
        try {
            setIsLoading(true);

            // Convert username to internal email
            const internalEmail = usernameToEmail(data.username);

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: internalEmail,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                        username: data.username,
                        role: data.role,
                        phone: data.phone,
                    },
                },
            });

            if (authError) {
                // Make error message more user-friendly
                if (authError.message.includes('already registered')) {
                    return { error: new Error('اسم المستخدم مستخدم بالفعل') };
                }
                return { error: authError };
            }

            // Update profile with username
            if (authData.user) {
                await supabase
                    .from('profiles')
                    .update({
                        name: data.name,
                        phone: data.phone || null,
                    })
                    .eq('id', authData.user.id);

                const userProfile = await fetchProfile(authData.user.id);
                setProfile(userProfile);
            }

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        } finally {
            setIsLoading(false);
        }
    };

    // Sign in existing user with username
    const signIn = async (username: string, password: string): Promise<{ error: Error | null }> => {
        try {
            setIsLoading(true);

            // Convert username to internal email
            const internalEmail = usernameToEmail(username);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: internalEmail,
                password,
            });

            if (error) {
                return { error: new Error('اسم المستخدم أو كلمة المرور غير صحيحة') };
            }

            if (data.user) {
                const userProfile = await fetchProfile(data.user.id);
                setProfile(userProfile);
            }

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        } finally {
            setIsLoading(false);
        }
    };

    // Sign out
    const signOut = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setSession(null);
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (updates: Partial<Profile>): Promise<{ error: Error | null }> => {
        if (!user) {
            return { error: new Error('No user logged in') };
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) {
                return { error };
            }

            // Refresh profile
            const updatedProfile = await fetchProfile(user.id);
            setProfile(updatedProfile);

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    };

    // Complete onboarding (set goals and level)
    const completeOnboarding = async (goals: string[], level: string): Promise<{ error: Error | null }> => {
        return updateProfile({ goals, level: level as Profile['level'] });
    };

    const value: AuthContextType = {
        user,
        profile,
        session,
        isLoading,
        isAuthenticated: !!user && !!profile,
        signUp,
        signIn,
        signOut,
        updateProfile,
        completeOnboarding,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
