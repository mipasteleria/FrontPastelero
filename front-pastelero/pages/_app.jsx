// src/pages/_app.js
import { AuthProvider } from '../src/context';
import {CartProvider} from "@/src/components/enuser/carritocontext";
import "@/styles/globals.css";
import 'react-calendar/dist/Calendar.css'; 

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;