// hooks/useSession.ts
import { useState, useEffect } from "react";

export const useSession = () => {
  const [userProfile, setUserProfile] = useState<{ pin: string; hasBiometrics: boolean } | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("user_vault_profile");
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
  }, []);

  const setupProfile = (pin: string, biometrics: boolean) => {
    const profile = { pin, hasBiometrics: biometrics };
    localStorage.setItem("user_vault_profile", JSON.stringify(profile));
    setUserProfile(profile);
  };

  return { userProfile, setupProfile };
};