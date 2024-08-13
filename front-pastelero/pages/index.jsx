import Image from "next/image";
import WebFooter from "@/src/components/WebFooter";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  return (
    <main className={`min-h-screen ${poppins.className}`}>
      <NavbarAdmin />
      <div className={`text-text max-w-screen-lg mx-auto mt-24`}>
        <section className="m-8 flex flex-col items-center lg:flex-row justify-between">
          <div className="flex justify-center md:w-1/2">
            <div className="flex justify-center w-full aspect-w-4 aspect-h-3 md:rounded-xl overflow-hidden">
              <iframe
                className="w-80 h-56 sm:w-80 md:w-full lg:h-72 rounded-xl"
                src="https://www.youtube.com/embed/ib1V_Z9sjHQ"
                title="Video de pasteles"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="md:basis-1/2 md:flex md:flex-col md:gap-6 m-6">
            <h1 className={`text-center text-4xl ${sofia.className}`}>
              Horneando Recuerdos
            </h1>
            <p className="text-center text-lg my-6">
              ¿Cuántos de tus recuerdos más preciados incluyen un delicioso pastel? 
              En nuestra pastelería, ofrecemos calidad y personalización en cada pastel. 
              Visita nuestra galería para admirar nuestros diseños y descubrir la calidad que 
              nos distingue. <br /> ¡Convierte tus momentos especiales en experiencias inolvidables!
            </p>
            <div className="flex flex-col gap-4 justify-center items-center">
              <Link href="/enduser/solicitarcotizacion">
                <button className="bg-primary font-bold p-6 px-8 rounded-md shadow-lg w-72">
                  ¡COTIZA HOY MISMO!
                </button>
              </Link>
            </div>
          </div>
        </section>
        <section className="m-1 mb-20 bg-rose-50 py-6 rounded-lg">
          <Link href="/enduser/conocenuestrosproductos">
            <h2 className={`m-6 text-center text-4xl ${sofia.className}`}>
              Conoce Nuestros Productos
            </h2>
          </Link>
          <div className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row items-center md:flex-row md:mt-10 md:justify-center gap-10 font-bold">
            <div className="flex flex-col items-center">
              <Image
                className="w-52 h-52 rounded-full border border-accent"
                src="/img/sabores.jpeg"
                width={190}
                height={190}
                alt="Foto de flan de sabores"
              />
              <div className="text-center pt-1 md:pt-3 text-lg m-4">
                Nuestros Sabores
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Image
                className="w-52 h-52 rounded-full border border-accent"
                src="/img/pay.jpeg"
                width={190}
                height={190}
                alt="Foto de postres"
              />
              <div className="text-center pt-1 md:pt-3 text-lg m-4">
                Postres
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Image
                className="w-52 h-52 rounded-full border border-accent"
                src="/img/yoda.jpg"
                width={190}
                height={190}
                alt="Foto de pastel 3D Yoda"
              />
              <div className="text-center pt-1 md:pt-3 text-lg m-4">
                Pasteles 3D
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Image
                className="w-52 h-52 rounded-full border border-accent"
                src="/img/coockies.jpg"
                width={190}
                height={190}
                alt="Foto de galletas americanas"
              />
              <div className="text-center pt-1 md:pt-3 text-lg m-4">
                Galletas Americanas
              </div>
            </div>
          </div>
        </section>
        <section className="md:flex m-10 mb-20 gap-4">
          <div className="md:w-1/2 mb-8">
            <h2 className={`text-center text-4xl ${sofia.className}`}>
              Conócenos
            </h2>
            <p className="text-center text-lg my-4">
              ¡Bienvenidos a Pastelería El Ruiseñor! Nos encanta añadir ese toque dulce a tus eventos 
              y ocasiones especiales con diseños personalizados que se adaptan a tus necesidades. 
              Estamos ubicados en el hermoso Guadalajara, Jalisco.
            </p>
            <div className="text-center my-10">
              <Link href="/enduser/conocenos#preguntasfrecuentes">
                <button className="italic">
                  Leer más...
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:w-1/2">
            <Image
              className="rounded-xl"
              src="/img/home.jpg"
              width={450}
              height={450}
              alt="Foto de pasteles"
            />
          </div>
        </section>
      </div>
      <WebFooter />
    </main>
  );
}
