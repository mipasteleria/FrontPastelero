// src/pages/_app.js
import { useRouter } from "next/router";
import { AuthProvider } from "../src/context";
import { CartProvider } from "@/src/components/enuser/carritocontext";
import AdminGuard from "@/src/components/AdminGuard";
import "@/styles/globals.css";
import "react-calendar/dist/Calendar.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // Cualquier ruta bajo /dashboard requiere sesión admin. El guard se aplica
  // una sola vez aquí para no tener que envolver página por página.
  const isDashboard = router.pathname.startsWith("/dashboard");

  const page = <Component {...pageProps} />;

  return (
    <AuthProvider>
      <CartProvider>
        {isDashboard ? <AdminGuard>{page}</AdminGuard> : page}
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
