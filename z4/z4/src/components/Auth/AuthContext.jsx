import React, {createContext, useContext, useState, useEffect} from 'react';
import api from '../../api.js';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // sprawdzenie tokena
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // decoding
                const decoded = jwtDecode(token);
                // sprawdzenie ważności tokenu
                // if (decoded.exp * 1000 < Date.now()) {
                //     logout();
                // } else {
                    setUser({id: decoded.id, role: decoded.role});
                // }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
        setLoading(false);
    }, []);


    // logout
    const logout = () => {
        console.log("dupa")
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    // sprawdzenie roli
    const hasRole = (role) => {
        return user && user.role === role;
    }



    const value = {
        user,
        loading,
        logout,
        hasRole
    };

    if (loading) {
        return <div>Ładowanie danych użytkownika...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};