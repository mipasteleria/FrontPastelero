import { useState, useContext } from "react";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import VerCotizacion from "@/src/components/cotizacionview";
import { CartContext } from "@/src/components/enuser/carritocontext";
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
  const [status, setStatus] = useState(""); // Inicializa el estado correctamente
  const [name, setName] = useState(""); // Inicializa el estado correctamente

  const productQuantity = cart.getProductQuantity(id, source, paymentOption); // Pasar solo los valores necesarios

  const handleCotizacionLoaded = ({ precio, anticipo, status, name }) => {
    setPrecio(precio);
    setAnticipo(anticipo);
    setStatus(status); // Actualizar el estado correctamente
    setName(name); // Actualizar el estado correctamente
  };

  const amount = paymentOption === "anticipo" ? anticipo : precio; // Seleccionar monto basado en la opción

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

  const handleCheckboxChange = (e) => {
    setPaymentOption(e.target.value);
    console.log(
      `Antes de agregar al carrito ${id},"source" ${source},"amount" ${amount},"paymenOption" ${paymentOption}`
    );
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Evita cualquier comportamiento predeterminado que cambie la URL

    // Verificar si el artículo ya está en el carrito
    if (productQuantity > 0) {
      alert("Este artículo ya está en el carrito.");
      return; // No agregar si ya está en el carrito
    }

    cart.addOneToCart({
      id: id,
      source: source.toLowerCase(),
      amount: amount, // Monto seleccionado
      paymentOption: paymentOption, // Tipo de pago (anticipo o total)
      status: status, // Estado
      name: name, // Nombre del producto
    });

    console.log(
      `Agregado al carrito: ${id},"source" ${source},"amount" ${amount},"paymenOption" ${paymentOption}`
    );
  };

  return (
    <div className={`text-text min-h-screen ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <main className="w-3/4 p-4">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>
            Detalle de Solicitud de cotización
          </h1>
          <form className="m-4">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <div className="mb-6">
                   {/* Elegir pago */}
              <div className="mb-4">
                <label className="mr-4">
                  <input
                    type="radio"
                    className="mr-2 text-rose-300 focus:ring-rose-300" 
                    name="paymentOption"
                    value="anticipo"
                    onChange={handleCheckboxChange}
                  />
                  Pagar Anticipo (${anticipo})
                </label>
                <label>
                  <input
                    type="radio"
                    className="mr-2 text-rose-300 focus:ring-rose-300" 
                    name="paymentOption"
                    value="total"
                    onChange={handleCheckboxChange}
                    defaultChecked // Iniciar con el total seleccionado
                  />
                  Pagar Total (${precio})
                </label>
              </div>
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

             
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
