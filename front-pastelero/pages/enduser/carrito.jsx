import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/src/components/enuser/carritocontext";
import { useAuth } from "@/src/context";
import NavbarAdmin from '@/src/components/navbar';
import WebFooter from '@/src/components/WebFooter';
import { Poppins as PoppinsFont, Sofia as SofiaFont } from 'next/font/google';
import Link from 'next/link';
import CartProduct from '@/src/components/enuser/carritocart';
import { useRouter } from 'next/router';

const poppins = PoppinsFont({ subsets: ['latin'], weight: ['400', '700'] });
const sofia = SofiaFont({ subsets: ['latin'], weight: ['400'] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Carrito() {
  const { userToken } = useAuth();
  const { items } = useContext(CartContext);
  const [checkoutError, setCheckoutError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (items) setLoading(false);
  }, [items]);

  const handleClick = async () => {
    if (!items || items.length === 0) return;
    setCheckoutError(null);

    const item = items[0];
    // source se guarda en minúsculas ("pastel"), el backend espera capitalizado ("Pastel")
    const cotizacionType = item.source.charAt(0).toUpperCase() + item.source.slice(1);

    try {
      const response = await fetch(`${API_BASE}/checkout/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          cotizacionId: item.id,
          cotizacionType,
          paymentOption: item.paymentOption,
        }),
      });

      const sessionData = await response.json();

      if (!response.ok) {
        setCheckoutError(sessionData.message || 'Error al iniciar el pago');
        return;
      }

      localStorage.setItem('clientSecret', sessionData.clientSecret);
      router.push('/enduser/pagar');
    } catch (error) {
      console.error('Error al crear sesión de pago:', error);
      setCheckoutError('No se pudo conectar con el servidor. Intenta de nuevo.');
    }
  };

  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <NavbarAdmin />
      <main className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24`}>
        <h1 className={`text-4xl m-4 ${sofia.className}`}>Su carrito</h1>
        {items && items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 p-4 shadow-md">
              {items.map((item) => (
                <CartProduct
                  key={item.id}
                  id={item.id}
                  source={item.source}
                  paymentOption={item.paymentOption}
                  quantity={item.quantity}
                  nombre={item.name}
                  status={item.status}
                  amount={item.amount}
                />
              ))}
            </div>

            {checkoutError && (
              <p className="text-red-600 text-sm text-center mx-6 mt-4">{checkoutError}</p>
            )}
            <div className="flex flex-col m-6 md:m-20 md:flex-row justify-center items-center gap-4">
              <button
                className="shadow-lg text-text bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-6 py-4 w-56"
                type="button"
                onClick={handleClick}
              >
                Pagar
              </button>
              <Link href="/">
                <button
                  className="shadow-lg text-text bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-6 py-4 w-56">
                  Seguir explorando
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p>No hay productos en el carrito.</p>
        )}
      </main>
      <WebFooter />
    </div>
  );
}
