import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax; Secure`;
}

export function useSessionId(): string {
  const [sessionId, setSessionIdState] = useState<string>("");

  useEffect(() => {
    let existingSessionId = getCookie("sessionId");
    if (!existingSessionId) {
      existingSessionId = uuidv4();
      setCookie("sessionId", existingSessionId);
    }
    setSessionIdState(existingSessionId);
  }, []);

  return sessionId;
}
