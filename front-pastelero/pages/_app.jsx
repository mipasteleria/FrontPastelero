// src/pages/_app.js
import { AuthProvider } from '../src/context';
import "@/styles/globals.css";
import 'react-calendar/dist/Calendar.css'; 
import '../src/components/calendario/styles/datepicker.css'; 

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
