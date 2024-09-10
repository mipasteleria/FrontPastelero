import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/src/components/enuser/carritocontext"; // Asegúrate de que la ruta sea correcta
import { useAuth } from "@/src/context";
import { AuthContext } from "@/src/context";
import NavbarAdmin from '@/src/components/navbar';
import WebFooter from '@/src/components/WebFooter';
import { Poppins as PoppinsFont, Sofia as SofiaFont } from 'next/font/google';
import Link from 'next/link';
import CartProduct from '@/src/components/enuser/carritocart'; // Asegúrate de importar el componente CartProduct

const poppins = PoppinsFont({ subsets: ['latin'], weight: ['400', '700'] });
const sofia = SofiaFont({ subsets: ['latin'], weight: ['400'] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Carrito() {
  const { userEmail } = useContext(AuthContext);
  const { userId } = useContext(AuthContext);
  const { cartItems, totalAmount } = useContext(CartContext); // Obtén cartItems y totalAmount del contexto
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  console.log(cartItems)

  useEffect(() => {
    setAmount(totalAmount); // Actualiza el monto total del carrito
    setLoading(false);
  }, [totalAmount]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <NavbarAdmin />
      <main className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24`}>
        <h1 className={`text-4xl m-4 ${sofia.className}`}>Su carrito</h1>
        {cartItems && cartItems.length > 0 ? ( // Verifica si cartItems está definido
          <>
            <div className="grid grid-cols-1 gap-4 p-4 shadow-md">
              {cartItems.map((item) => (
                <CartProduct
                  key={item.id}
                  id={item.id}
                  quantity={item.quantity}
                />
              ))}
            </div>
            <div className="mb-4">
              <label className="mr-4">
                <input
                  type="radio"
                  name="paymentOption"
                  value="anticipo"
                  onChange={handleCheckboxChange}
                />
                Pagar Anticipo (${anticipo})
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentOption"
                  value="total"
                  onChange={handleCheckboxChange}
                  defaultChecked // Iniciar con el total seleccionado
                />
                Pagar Total (${amount})
              </label>
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
