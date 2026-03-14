"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import Cookies from 'js-cookie';

interface User {
    _id: string;
    alias: string;
    collegeId: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: () => { },
    logout: () => { }
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token') || Cookies.get('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (error) {
                    console.error('Failed to load user', error);
                    localStorage.removeItem('token');
                    Cookies.remove('token');
                }
            }
            setIsLoading(false);
        };
        loadUser();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        Cookies.set('token', token, { expires: 30 }); // 30 days
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        Cookies.remove('token');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
