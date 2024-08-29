import Link from "next/link";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Carrito() {
  const handleClick = async (event) => {
    try {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud de creación de sesión de pago');
      }

      const session = await response.json();
      const stripe = Stripe('your-publishable-key-here');

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
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <NavbarAdmin />
      <main className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24`}>
        <h1 className={`text-4xl m-4 ${sofia.className}`}>Su carrito</h1>
        <div className="flex flex-col md:flex-row gap-8 bg-rose-50 p-6 justify-between w-full">
          <figure className="max-w-lg m-6">
            <Image
              className="h-auto max-w-full rounded-lg"
              width={500}
              height={500}
              src="/img/animalcrossing.jpg"
              alt="Imagen del carrito"
            />
            <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
              Ejemplo de imagen
            </figcaption>
          </figure>
          <div className="flex flex-col gap-10 md:mr-64">
            <p>Número de orden:</p>
            <p>Costo total:</p>
          </div>
        </div>
        <div className="mb-10">
          <h2 className={`text-3xl m-4 ${sofia.className}`}>
            Condiciones e información importante
          </h2>
          <div className="bg-rose-50 m-4 flex flex-col gap-4 p-4">
            <p>
              Para iniciar su pedido, se solicita un anticipo del 50% del total.
              Favor de confirmar disponibilidad antes de hacer su pedido.
            </p>
            <p>
              <strong>Vigencia:</strong> El presupuesto es válido por 30 días a partir de la
              fecha estipulada en la orden.
            </p>
            <p>
              <strong>Cancelaciones:</strong> Podrá cancelar su pedido hasta 5 días antes de
              la fecha de entrega, llamando o enviando un mensaje de 9 am a 5 pm
              de lunes a viernes. Se aplicará un cargo del 30% del total del
              pedido; después de este plazo, el cargo será del 50%.
            </p>
            <p>
              <strong>Cambios de diseño:</strong> Puede realizar cambios en el diseño hasta 5
              días antes de la fecha de entrega, lo que podría modificar la
              cotización.
            </p>
            <p>
              <strong>Liquidar y recoger:</strong> Se solicita liquidar su pedido un día
              antes de la entrega. Para recoger su pedido, por favor indique su
              número de orden.
            </p>
          </div>
        </div>
        <p className="text-accent m-6">
          Muchas gracias por tomarte el tiempo para leer toda la información,
          quedamos al pendiente para cualquier duda o aclaración. Te recordamos
          que el horario de atención es de lunes a viernes de 9 am a 6 pm.
        </p>
        <div className="flex flex-col m-6 md:m-20 md:flex-row justify-center items-center gap-4">
        <Link href="/enduser/pagar">
          <button 
            className="shadow-lg text-text bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-6 py-4 w-56" 
            type="button" 
            onClick={handleClick}
          >
            Pagar
          </button>
        </Link>
          <Link href="/">
            <button className="shadow-lg text-text bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-6 py-4 w-56">
              Seguir explorando
            </button>
          </Link>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}

