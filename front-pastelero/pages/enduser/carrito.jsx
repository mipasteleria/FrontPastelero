import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import WebFooter from "@/src/components/WebFooter";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Carrito() {
  return (
    <div>
      <NavbarAdmin />
      <main className={`text-text ${poppins.className} md:mb-28`}>
      <h1 className={`text-4xl m-6 ${sofia.className}`}>Su carrito</h1>
      <div className="flex flex-col md:flex-row gap-8 bg-rose-50 p-6 justify-between w-full">
            <figure class="max-w-lg m-6">
            <img class="h-auto max-w-full rounded-lg" src="/img/animalcrossing.jpg" alt="image description"/>
            <figcaption class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">Ejemplo de imagen</figcaption>
            </figure>
            <div className="flex flex-col gap-10 md:mr-64">
                <p>Número de orden:</p>
                <p>Costo total:</p>
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
        <div className="flex flex-col m-6 md:m-20 md:flex-row justify-center items-center gap-4">
            <Link href="/enduser/detallecotizacion">
                <button className="text-text bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-6 py-4 w-56">
                Pagar
                </button>
            </Link>
            <Link href="/enduser/carrito">
                <button className="text-text bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-6 py-4 w-56">
                Seguir comprando
                </button>
            </Link>
            </div>

    </main>
    <WebFooter/>
    </div>
  );
}