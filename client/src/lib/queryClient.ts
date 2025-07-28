import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey, signal }) => {
        const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
        const res = await fetch(url as string, { signal });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
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
    ...options,
  });
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  
  return res.json();
};