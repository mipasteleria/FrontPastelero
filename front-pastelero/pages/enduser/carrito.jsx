import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/src/components/enuser/carritocontext"; 
import { AuthContext } from "@/src/context";
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
  const { userEmail } = useContext(AuthContext);
  const { userId } = useContext(AuthContext);
  const { totalAmount, items } = useContext(CartContext); // Obtén items y totalAmount del contexto
  const [Client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Asegúrate de que loading cambie cuando los datos estén disponibles
  useEffect(() => {
    if (items) {
      setLoading(false);
    }
  }, [items]);

  const handleClick = async () => {
    // Estructurando purchaseData para enviar los datos correctamente
    const dataToSend = {
      Items: items.length, // Cantidad de items en el carrito
      amount: items.reduce((total, item) => total + item.amount, 0)|| 100, // Total del monto a pagar
      status: items[0]?.status || "No Aprobado", // El valor inicial de status
      userId: userId, // El ID del usuario desde el contexto de AuthContext
      email: userEmail, // El email del usuario desde el contexto de AuthContext
      quantity:items.reduce((total, item) => total + item.quantity, 0), // Sumar todas las cantidades de los items
      name: items[0]?.name || "Sin nombre", // Puedes ajustar si deseas más detalles de nombre
      paymentOption: items[0]?.paymentOption || "Sin opción", // Ajusta si cada item tiene diferentes opciones de pago
    };
  
    console.log('Datos que se enviarán al backend:', dataToSend);
  
    try {
      const response = await fetch(`http://localhost:3001/checkout/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Envía los datos correctamente formateados
      });
  
      if (response.ok) {
        const sessionData = await response.json();
        console.log('Datos enviados con éxito:', sessionData);
        
        // Extrae correctamente el clientSecret de la respuesta del servidor
        const clientSecret = sessionData.clientSecret;
        
        // Guarda el clientSecret en el localStorage
        localStorage.setItem('clientSecret', clientSecret);
        
        // Actualiza el estado con el clientSecret
        setClient(clientSecret);
        
        // Redirige a la página de pago
        router.push('/enduser/pagar');
      } else {
        console.error('Error al enviar los datos al backend:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar los datos al backend:', error);
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
