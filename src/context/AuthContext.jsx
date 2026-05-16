'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    let authListener;

    if (supabase && supabase.auth) {
      try {
        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            const currentUser = session?.user;
            setUser(currentUser ? { email: currentUser.email, name: currentUser.email.split('@')[0] } : null);
          }
        );
        authListener = data;

        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user;
            setUser(currentUser ? { email: currentUser.email, name: currentUser.email.split('@')[0] } : null);
        });
      } catch (e) {
        console.error("Error setting up Supabase auth listener", e);
      }
    }

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase]);

  const login = async (email, password) => {
    if (supabase && supabase.auth) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error logging in:', error.message);
        return false;
      }

      return true;
    }
    return false;
  };

  const logout = async () => {
    if (supabase && supabase.auth) {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
