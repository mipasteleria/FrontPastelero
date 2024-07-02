import "@/styles/globals.css";
import 'react-calendar/dist/Calendar.css'; 
import '../src/components/calendario/styles/datepicker.css'; 

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
