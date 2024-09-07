import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import VerCotizacion from "@/src/components/cotizacionview";
import { useRouter } from "next/router";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { FaShoppingCart, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useState } from "react";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function pedidos() {
  const router = useRouter();
  const { id, source } = router.query;
  
  // Estado para almacenar el carrito
  const [cart, setCart] = useState([]);

  const CancelCotizacion = async (id, source) => {
    try {
        const token = localStorage.getItem("token");
        let url;

        switch (source) {
            case "pastel":
                url = `${API_BASE}/pricecake/${id}`;
                break;
            case "cupcake":
                url = `${API_BASE}/pricecupcake/${id}`;
                break;
            case "snack":
                url = `${API_BASE}/pricesnack/${id}`;
                break;
            default:
                console.error("Invalid source: ", source);
                return;
        }

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                status: "Cancelado",
            }),
        });

        if (response.ok) {
            console.log("Cotización cancelada exitosamente");
        } else {
            console.error("Failed to cancel the item. Status:", response.status);
        }
    } catch (error) {
        console.error("An error occurred while canceling the item:", error);
    }
  };

  const onAddToCart = async (id, source) => {
    try {
      const item = { id, source }; // Crear el objeto del ítem
      setCart((prevCart) => [...prevCart, item]); // Agregar el ítem al carrito
      console.log(`Agregado al carrito: ${id}, source: ${source}`);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  return (
    <div className={`text-text min-h-screen ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <main className="w-3/4 p-4">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>
            Ver detalle de Solicitud de cotización
          </h1>
          <form className="m-4">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <div className="mb-6">
                <button
                onClick={() => onAddToCart(id, source)}
                className="bg-rose-300 text-white p-2 rounded-lg flex items-center space-x-2 hover:bg-green-300"
              >
                <FaShoppingCart size={20} /> {/* Icono del carrito */}
                <span>Agregar al carrito</span>
              </button>

              <button
                onClick={() => CancelCotizacion(id, source)}
                className="bg-rose-200 text-white p-2 rounded-lg flex items-center space-x-2 hover:bg-red-600"
              >
                <FaTimes size={20} /> {/* Icono de cancelar */}
                <span>Cancelar</span>
              </button>

              <button
                onClick={() => router.push("/enduser/detallesolicitud/mispedidos")} 
                className="bg-blue-300 text-white p-2 rounded-lg flex items-center space-x-2 hover:bg-blue-500"
              >
                <FaArrowLeft size={20} /> {/* Icono de regreso */}
                <span>Regresar</span>
              </button>
                </div>
              </div>

              <VerCotizacion />
              
              
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
