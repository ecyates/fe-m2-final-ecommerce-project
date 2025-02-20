// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";


interface AuthContextType { 
    user: User | null;
    loading: boolean;
    error: string | null;
}

export const AuthContext = createContext<AuthContextType>({user:null, loading: true, error:null});

export const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string |null>(null);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
            setLoading(false);
            setError(null);
        });

        return ()=>{
            try{
                unsubscribe();
            }catch(err:any){
                setError(err.message);
            }};
    }, []);

    return <AuthContext.Provider value={{ user, loading, error }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);