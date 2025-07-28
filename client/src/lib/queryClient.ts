import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey, signal }) => {
        const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
        const res = await fetch(url as string, { 
          signal,
          credentials: 'include', // Include cookies for session
        });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error(`401: ${res.statusText} - Unauthorized`);
          }
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        return res.json();
      },
    },
  },
});

// Helper function for mutations
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: 'include', // Include cookies for session
    ...options,
  });
  
  if (!res.ok) {
    let message;
    try {
      const errorData = await res.json();
      message = errorData.message || `HTTP error! status: ${res.status}`;
    } catch {
      message = `HTTP error! status: ${res.status}`;
    }
    throw new Error(message);
  }
  
  return res.json();
};