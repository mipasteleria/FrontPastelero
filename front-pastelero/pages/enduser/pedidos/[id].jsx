import { useState, useContext } from "react";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import VerCotizacion from "@/src/components/cotizacionview";
import { CartContext } from "@/src/components/enuser/carritocontext";
import { useRouter } from "next/router";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { FaShoppingCart, FaTimes, FaArrowLeft } from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Pedidos() {
  const router = useRouter();
  const { id, source } = router.query;
  const [paymentOption, setPaymentOption] = useState("total");
  const cart = useContext(CartContext);

  const [anticipo, setAnticipo] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [saldoPendiente, setSaldoPendiente] = useState(0);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");

  const productQuantity = cart.getProductQuantity(id, source, paymentOption);

  const handleCotizacionLoaded = ({ precio, anticipo, status, name, saldoPendiente }) => {
    setPrecio(precio);
    setAnticipo(anticipo);
    setStatus(status);
    setName(name);
    setSaldoPendiente(saldoPendiente ?? 0);
    // Pre-seleccionar "saldo" si corresponde
    if (status === "Agendado con el 50%" && saldoPendiente > 0) {
      setPaymentOption("saldo");
    }
  };

  const yaAgendadoTotal = status === "Agendado con el 100%";
  const pendeSaldo = status === "Agendado con el 50%" && saldoPendiente > 0;

  const amount = paymentOption === "anticipo"
    ? anticipo
    : paymentOption === "saldo"
    ? saldoPendiente
    : precio;

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
                  {/* Estado de pago */}
              <div className="mb-4">
                {yaAgendadoTotal && (
                  <p className="text-green-600 font-semibold mb-2">
                    ✓ Esta cotización ya está pagada en su totalidad.
                  </p>
                )}
                {pendeSaldo && (
                  <p className="text-amber-600 font-semibold mb-2">
                    ⚠ Saldo pendiente por liquidar: ${saldoPendiente} MXN
                  </p>
                )}

                {/* Opciones de pago — ocultas si ya pagó todo */}
                {!yaAgendadoTotal && (
                  <div className="flex flex-col gap-2">
                    {pendeSaldo ? (
                      <label>
                        <input
                          type="radio"
                          className="mr-2 text-rose-300 focus:ring-rose-300"
                          name="paymentOption"
                          value="saldo"
                          checked
                          readOnly
                        />
                        Liquidar saldo (${saldoPendiente} MXN)
                      </label>
                    ) : (
                      <>
                        <label>
                          <input
                            type="radio"
                            className="mr-2 text-rose-300 focus:ring-rose-300"
                            name="paymentOption"
                            value="anticipo"
                            onChange={handleCheckboxChange}
                          />
                          Pagar Anticipo (${anticipo} MXN)
                        </label>
                        <label>
                          <input
                            type="radio"
                            className="mr-2 text-rose-300 focus:ring-rose-300"
                            name="paymentOption"
                            value="total"
                            onChange={handleCheckboxChange}
                            defaultChecked
                          />
                          Pagar Total (${precio} MXN)
                        </label>
                      </>
                    )}
                  </div>
                )}
              </div>
                  {!yaAgendadoTotal && (
                    <button
                      onClick={handleAddToCart}
                      className="bg-rose-300 text-white p-2 rounded-lg flex items-center space-x-2 hover:bg-green-300"
                    >
                      <FaShoppingCart size={20} />
                      <span>{pendeSaldo ? "Agregar saldo al carrito" : "Agregar al carrito"}</span>
                    </button>
                  )}

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
