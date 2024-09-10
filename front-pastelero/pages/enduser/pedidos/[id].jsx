import { useState, useContext } from "react";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import VerCotizacion from "@/src/components/cotizacionview";
import { CartContext } from "@/src/components/enuser/carritocontext"
import { useRouter } from "next/router";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { FaShoppingCart, FaTimes, FaArrowLeft } from "react-icons/fa";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Pedidos() {
  const router = useRouter();
  const { id, source } = router.query;
  const [paymentOption, setPaymentOption] = useState("total");
  const cart = useContext(CartContext);
  

  const [anticipo, setAnticipo] = useState(0);
  const [precio, setPrecio] = useState(0);
  const[status,setStatus] = useState("");
  const[name,setName] = useState("");

  const productQuantity = cart.getProductQuantity(id, source, paymentOption, status, name); // Pasar id, source, paymentOption, status y name
  
  const handleCotizacionLoaded = ({ precio, anticipo }) => {
    setPrecio(precio);
    setAnticipo(anticipo);
    status(status);
    name(name);
  };

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

  const handleAddToCart = (e) => {
    e.preventDefault(); // Evita cualquier comportamiento predeterminado que cambie la URL

    // Verificar si el artículo ya está en el carrito
    if (productQuantity > 0) {
      alert("Este artículo ya está en el carrito.");
      return; // No agregar si ya está en el carrito
    }

    const amount = paymentOption === "anticipo" ? anticipo : precio; // Seleccionar monto basado en la opción
    cart.addOneToCart({
      id: id,
      source: source.toLowerCase(),
      amount: amount, // Monto seleccionado
      paymentType: paymentOption, // Tipo de pago (anticipo o total)
    });

    console.log(`Agregado al carrito: ${id}, ${source}, ${amount}, ${paymentOption}`); // Verificar en consola
  };

  const handleCheckboxChange = (e) => {
    setPaymentOption(e.target.value);
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
                    onClick={handleAddToCart}
                    className="bg-rose-300 text-white p-2 rounded-lg flex items-center space-x-2 hover:bg-green-300"
                  >
                    <FaShoppingCart size={20} />
                    <span>Agregar al carrito</span>
                  </button>

                  <button
                    onClick={() => CancelCotizacion(id, source)}
                    className="bg-rose-200 text-white p-2 rounded-lg flex items-center space-x-2 hover:bg-red-600"
                  >
                    <FaTimes size={20} />
                    <span>Cancelar</span>
                  </button>

                  <button
                    onClick={() =>
                      router.push({
                        pathname: "/enduser/mispedidos",
                        query: { id, source },
                      })
                    }
                    className="bg-blue-300 text-white p-2 rounded-lg flex items-center space-x-2 hover:bg-blue-500"
                  >
                    <FaArrowLeft size={20} />
                    <span>Regresar</span>
                  </button>
                </div>
              </div>

              <VerCotizacion onCotizacionLoaded={handleCotizacionLoaded} />

              {/* Elegir pago */}
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
                  Pagar Total (${precio})
                </label>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
