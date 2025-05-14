"use client";
import { getUserFromToken } from "@/app/actions/auth";
import { useEffect, useState } from "react";

interface DecodedToken {
  sub: number;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export default function useUserFromCookie() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = (await getUserFromToken()) as DecodedToken;
        console.log("result", result);
        if (result && result.username) {
          setUser(result);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  console.log("user", user);

  return user;
}
