import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define a type for the user
interface User {
    username: string;
    // Add other user properties if needed
}

// Define a type for the context value
interface UserContextValue {
    user: User | null;
    setUser: (user: User | null) => void;
}

// Define a type for the UserProvider props
interface UserProviderProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};