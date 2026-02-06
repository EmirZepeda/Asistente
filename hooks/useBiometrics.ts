// hooks/useBiometrics.ts
export const useBiometrics = () => {
  const checkBiometrics = async () => {
    try {
      // Verifica si el dispositivo soporta biometría
      const hasHardware = await window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!hasHardware) throw new Error("Hardware no disponible");

      // Esto dispara el FaceID/Huella real del sistema operativo
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "TaskLock App" },
          user: {
            id: new Uint8Array(16),
            name: "user@tasklock.com",
            displayName: "Usuario Seguro",
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: { userVerification: "required" },
          timeout: 60000,
        },
      });

      return !!credential;
    } catch (error) {
      console.error("Error biometría:", error);
      return false;
    }
  };

  return { checkBiometrics };
};