"use client";

import { getUserFromToken } from "@/app/actions/auth";
import { useEffect, useState } from "react";

interface DecodedToken {
  sub: string; // Align with backend userId (string)
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export default function useUserFromCookie() {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = (await getUserFromToken()) as DecodedToken | null;
        console.log("Fetched user:", result);
        if (result && result.sub && result.username) {
          setUser({
            ...result,
            sub: String(result.sub), // Ensure sub is string
          });
        } else {
          setUser(null);
          setError("No valid user data found");
        }
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setUser(null);
        setError(err.message || "Failed to fetch user");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, isLoading, error };
}
