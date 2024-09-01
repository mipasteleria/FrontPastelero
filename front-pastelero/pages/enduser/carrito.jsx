import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavbarAdmin from '@/src/components/navbar';
import WebFooter from '@/src/components/WebFooter';
import { useAuth } from '@/src/context';
import { Poppins as PoppinsFont, Sofia as SofiaFont } from 'next/font/google';
import Importante from '@/src/components/carritodetails';
import Image from 'next/image';

const poppins = PoppinsFont({ subsets: ['latin'], weight: ['400', '700'] });
const sofia = SofiaFont({ subsets: ['latin'], weight: ['400'] });

export default function Carrito() {
  const { userId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anticipo, setAnticipo] = useState(0); // State to store anticipo

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = [
          'http://localhost:3001/pricecake/',
          'http://localhost:3001/pricecupcake/',
          'http://localhost:3001/pricesnack/',
        ];
        const requests = urls.map(url => fetch(url).then(res => res.json()));

        const responses = await Promise.all(requests);
        let mostRecentData = null;

        responses.forEach(response => {
          const userData = response.data.filter(item => item.userId === userId);
          if (userData.length > 0) {
            const mostRecentItem = userData.reduce((latest, item) => {
              return new Date(item.createdAt) > new Date(latest.createdAt) ? item : latest;
            });
            if (!mostRecentData || new Date(mostRecentItem.createdAt) > new Date(mostRecentData.createdAt)) {
              mostRecentData = mostRecentItem;
            }
          }
        });

        if (mostRecentData) {
          setData(mostRecentData);
          setAnticipo(mostRecentData.anticipo); // Set anticipo value
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleClick = async (event) => {
    try {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: anticipo }), // Send anticipo value
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud de creación de sesión de pago');
      }

      const session = await response.json();
      const stripe = 'pk_test_51PpLMA05NkS1u2DA81LiZRgfXzRPrk8hkDrlf3JnlqcxkGlOrbo9DXBPf78uimP3IC6xX3DJHVxp6DAOPqeNzSEz00P2FAWsMZ';

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        console.error("Error al redirigir al checkout:", error);
      }
    } catch (error) {
      console.error("Error en el proceso de checkout:", error);
    }
  };

  return (
    <div 
    className={`min-h-screen flex flex-col ${poppins.className}`}>
      <NavbarAdmin />
      <main 
      className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24`}>
        <h1 
        className={`text-4xl m-4 ${sofia.className}`}>Su carrito</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 shadow-md">
              <div>
                {data.image && (
                  <Image src={data.image} alt="Product" className="w-full h-auto mb-4 rounded-xl" />
                )}
                {data.status && (
                  <p className="text-2xl font-bold mb-4"><strong>Status:</strong> {data.status}</p>
                )}
              </div>
              <div>
                {Object.entries(data).filter(([key]) => !['image', 'status', 'anticipo'].includes(key)).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <p><strong>{key}:</strong> {value}</p>
                  </div>
                ))}
              </div>
              </div>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
        <Importante />
        <div 
        className="flex flex-col m-6 md:m-20 md:flex-row justify-center items-center gap-4">
          <Link 
          href="/enduser/pagar">
            <button 
              className="shadow-lg text-text bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-6 py-4 w-56" 
              type="button" 
              onClick={handleClick}
            >
              Pagar
            </button>
          </Link>
          <Link 
          href="/">
            <button 
            className="shadow-lg text-text bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-6 py-4 w-56">
              Seguir explorando
            </button>
          </Link>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}
