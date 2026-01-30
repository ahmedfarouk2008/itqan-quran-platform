import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, updateProfile as updateAuthProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, Profile, Session as AppSession } from '../lib/firebase';

// ==============================================
// Auth Context - إدارة حالة المستخدم مع Firebase
// Using Username instead of Email
// ==============================================

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: AppSession | null; // Using AppSession to avoid conflict if any
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
    const [session, setSession] = useState<AppSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user profile from database
    const fetchProfile = async (userId: string) => {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as Profile;
            } else {
                console.log('No such profile!');
                return null;
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    };

    // Initialize auth state
    useEffect(() => {
        let mounted = true;

        // Safety timeout to prevent infinite loading
        const loadingTimeout = setTimeout(() => {
            if (mounted && isLoading) {
                console.warn('Auth loading timed out - forcing completion');
                setIsLoading(false);
            }
        }, 4000);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!mounted) return;

            console.log('Auth state changed:', firebaseUser ? 'Logged In' : 'Logged Out');
            setUser(firebaseUser);

            if (firebaseUser) {
                const userProfile = await fetchProfile(firebaseUser.uid);
                if (mounted) {
                    setProfile(userProfile);
                }
                // Reset session if needed, or fetch active session logic here if applicable
                // setSession(null); 
            } else {
                if (mounted) {
                    setProfile(null);
                    setSession(null);
                }
            }

            if (mounted) {
                setIsLoading(false);
                clearTimeout(loadingTimeout);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(loadingTimeout);
            unsubscribe();
        };
    }, []);

    // Sign up new user with username
    const signUp = async (data: SignUpData): Promise<{ error: Error | null }> => {
        try {
            setIsLoading(true);

            // Convert username to internal email
            const internalEmail = usernameToEmail(data.username);
            console.log('Attempting signup with:', { email: internalEmail, name: data.name, username: data.username });

            const userCredential = await createUserWithEmailAndPassword(auth, internalEmail, data.password);
            const user = userCredential.user;

            // Update Auth Profile
            await updateAuthProfile(user, {
                displayName: data.name
            });

            // Create Profile in Firestore
            const newProfile: Profile = {
                id: user.uid,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                name: data.name,
                email: internalEmail,
                phone: data.phone || null,
                role: data.role as 'student' | 'teacher' | 'admin',
                avatar_url: null,
                level: null,
                goals: null,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                bio: null,
                specialty: null,
                rating: null,
                status: 'active',
                current_surah: null,
                current_ayah: null,
                memorized_ayahs: null,
                teacher_notes: null,
                total_surahs: null
            };

            await setDoc(doc(db, 'users', user.uid), newProfile);

            console.log('Auth signup successful:', user);
            const userProfile = await fetchProfile(user.uid);
            setProfile(userProfile);

            return { error: null };
        } catch (error: any) {
            console.error('Signup catch error:', error);
            // Make error message more user-friendly
            if (error.code === 'auth/email-already-in-use') {
                return { error: new Error('اسم المستخدم مستخدم بالفعل') };
            }
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

            const userCredential = await signInWithEmailAndPassword(auth, internalEmail, password);
            if (userCredential.user) {
                const userProfile = await fetchProfile(userCredential.user.uid);
                setProfile(userProfile);
            }

            return { error: null };
        } catch (error: any) {
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                return { error: new Error('اسم المستخدم أو كلمة المرور غير صحيحة') };
            }
            return { error: error as Error };
        } finally {
            setIsLoading(false);
        }
    };

    // Sign out
    const signOut = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await firebaseSignOut(auth);
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
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, updates);

            // Refresh profile
            const updatedProfile = await fetchProfile(user.uid);
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
        isAuthenticated: !!user, // Adjusted to just user check as profile might load slightly later? Or keep !!user && !!profile
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
