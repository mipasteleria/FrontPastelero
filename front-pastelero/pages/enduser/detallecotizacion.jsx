import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import WebFooter from "@/src/components/WebFooter";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function DetalleCotizacion() {
  return (
    <div>
      <NavbarAdmin />
      <main className={`text-text ${poppins.className} max-w-screen-lg mx-auto mt-24`}>
      <h1 className={`text-4xl m-4 ${sofia.className}`}>Cotización</h1>
      <div className="flex flex-col md:flex-row m-6 justify-between">
        <div className="flex flex-col mb-8">
            Diseño:
        </div>
        <div className="flex flex-col gap-8 md:mr-64">
            <p>Número de orden:</p>
            <p>Fecha de expedicion:</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-8 md:mr-64">
        <figure class="max-w-lg m-6 ">
        <img class="h-auto max-w-full rounded-lg" src="/img/animalcrossing.jpg" alt="image description"/>
        <figcaption class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">Ejemplo de imagen</figcaption>
        </figure>
        <div>
            <div className="m-6 flex flex-col gap-6">
                <p>En atención a:</p>
                <p>Fecha de entrega:</p>
                <p>Lugar y hora de entrega</p>
            </div>
            <div className="m-6 flex flex-col gap-6">
                <h2 className="text-center">Detalles del pedido</h2>
                <p>Número de porciones</p>
                <p>Sabor</p>
                <p>Relleno</p>
                <p>Cobertura</p>
            </div>
        </div>
      </div>
      <div className="mb-10">
            <h2 className={`text-3xl m-4 ${sofia.className}`}>Condiciones e informacion importante</h2>
            <div className="bg-rose-50 m-4 flex flex-col gap-4 p-4">
                <p>Para iniciar su pedido, se solicita un anticipo del 50% del total. Favor de confirmar disponibilidad antes de hacer su pedido.</p>
                <p>**Vigencia:** El presupuesto es válido por 30 días a partir de la fecha estipulada en la orden.</p>
                <p>**Cancelaciones:** Podrá cancelar su pedido hasta 5 días antes de la fecha de entrega, llamando o enviando un mensaje de 9am a 5pm de lunes a viernes. Se aplicará un cargo del 30% del total del pedido; después de este plazo, el cargo será del 50%.</p>
                <p>**Cambios de diseño:** Puede realizar cambios en el diseño hasta 5 días antes de la fecha de entrega, lo que podría modificar la cotización.</p>
                <p>**Liquidar y recoger:** Se solicita liquidar su pedido un día antes de la entrega. Para recoger su pedido, por favor indique su número de orden.</p>
            </div>
        </div>
        <p className="text-accent m-6">Muchas gracias por tomarte el tiempo para leer toda la información, quedamos al pendiente para cualquier
        duda o aclaración, te recordamos que el horario de atención es de Lunes a Viernes de 9am a 6pm.</p>
        <div className="flex flex-col md:flex-row m-6 justify-between">
            <div className="bg-rose-50 p-4">
                <div class="flex items-center mb-4">
                <input
                    checked
                    id="checkbox-1"
                    type="checkbox"
                    value=""
                    class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                />
                <label for="checkbox-1" class="ms-2 text-sm font-medium text-text">
                Costo total $2500
                </label>
                </div>
                <div class="flex items-center mb-4">
                <input
                    checked
                    id="checkbox-1"
                    type="checkbox"
                    value=""
                    class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                />
                <label for="checkbox-1" class="ms-2 text-sm font-medium text-text">
                Anticipo $1250 mx
                </label>
                </div>
            </div>
            <div className="flex flex-col items-center md:flex-row md:justify-end m-4 mb-8 gap-4">
                <Link href="/enduser/detallecotizacion">
                    <button className="shadow-lg text-text bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-4 py-2.5 w-52">
                        Cancelar
                    </button>
                </Link>
                <Link href="/enduser/carrito">
                    <button className="shadow-lg text-text bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-4 py-2.5 w-52">
                        Agregar al carrito
                    </button>
                </Link>
            </div>  
        </div>
    </main>
    <WebFooter/>
    </div>
  );
}