import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, LoginRequest, InsertUser } from "@shared/schema";
import { useState, useEffect } from "react";

export function useAuth() {
  const [authState, setAuthState] = useState<{
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (mounted) {
            setAuthState({
              user: data.user,
              isLoading: false,
              isAuthenticated: true,
            });
          }
        } else {
          // 401 or other error means not authenticated
          if (mounted) {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        }
      } catch (error) {
        if (mounted) {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    };

    checkAuth();
    
    return () => {
      mounted = false;
    };
  }, []);

  return authState;
}

export function useLogin() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      return apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully.",
      });
      // Reload the page to refresh auth state
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRegister() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userData: InsertUser) => {
      return apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Account created!",
        description: "Welcome to All Nighter. Start creating your first study project.",
      });
      // Reload the page to refresh auth state
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useLogout() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      return apiRequest("/api/auth/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You've been logged out successfully.",
      });
      // Reload the page to refresh auth state
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}