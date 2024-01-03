import { signOut } from "next-auth/react"

export const handleSessionExpiration = (response: any, notification: any ) => {
  if (response?.message) {
    let countDown = 4;

    notification(`Lo sentimos, la sesión expiró. Cerrando en 3 segundos.`, {
      variant: 'error',
    });

    const countdownInterval = setInterval(() => {
      countDown--;

      if (countDown < 0) {
        clearInterval(countdownInterval);
        signOut({ callbackUrl: 'http://localhost:3000/' });
      }
    }, 1000);
  }
};