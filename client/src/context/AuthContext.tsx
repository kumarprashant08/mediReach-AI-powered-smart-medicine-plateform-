import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  updateLocation: (lat: number, lng: number, address?: string) => void;
  userLocation: { latitude: number; longitude: number; address: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; address: string }>({
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'Connaught Place, New Delhi',
  });

  useEffect(() => {
  // Try auto-login from JWT token
  api.getMe().then((me) => {
    if (me) {
      setUser(me);
      if (me.location) {
        setUserLocation({
          latitude: me.location.latitude || 28.6139,
          longitude: me.location.longitude || 77.2090,
          address: me.location.address || 'Connaught Place, New Delhi',
        });
      }
    } else {
      // No token or invalid token – keep unauthenticated
      setUser(null);
    }
    setLoading(false);
  });

  // Request Browser Geolocation if available
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      () => {
        // Geolocation permission denied or unavailable - keep default location
      }
    );
  }
}, []);

  const login = async (email: string, pass: string) => {
    const loggedUser = await api.login(email, pass);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (data: any) => {
    const registeredUser = await api.register(data);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('medireach_token');
    setUser(null);
  };

  const updateLocation = (latitude: number, longitude: number, address?: string) => {
    setUserLocation({
      latitude,
      longitude,
      address: address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateLocation, userLocation }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
