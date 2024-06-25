import Image from "next/image";
import WebFooter from "@/src/components/WebFooter";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  return (
<main>
  <NavbarAdmin />
  <main className={`text-text ${poppins.className}`}>
    <div className="m-8 flex flex-col items-center lg:flex-row justify-between">
      <div className="flex justify-center md:w-1/2">
        <div className="flex justify-center w-full aspect-w-4 aspect-h-3 md:rounded-xl overflow-hidden">
          <iframe
            className="w-80 h-56 sm:w-80 md:w-full lg:h-96 rounded-xl"
            src="https://www.youtube.com/embed/ib1V_Z9sjHQ"
            title="Video de pasteles"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
      <div className="md:basis-1/2 md:flex md:flex-col md:gap-6 m-6">
        <div className="">
          <h1 className={`text-center text-4xl ${sofia.className}`}>
            Horneando Recuerdos
          </h1>
        </div>
        <div>
          <p className="text-center text-lg my-6">
            ¿Cuántos de tus recuerdos más preciados incluyen un delicioso pastel? En nuestra pastelería, ofrecemos calidad y personalización en cada pastel. Visita nuestra galería para admirar nuestros diseños y descubrir la calidad que nos distingue. <br /> ¡Convierte tus momentos especiales en experiencias inolvidables!
          </p>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center m-6">
          <Link href="/enduser/nuevasolicitud">
            <button className="bg-primary font-bold p-6 px-8 rounded-md">
              ¡COTIZA HOY MISMO!
            </button>
          </Link>
          <Link href="/enduser/preguntasfrecuentes">
            <button className={`bg-primary font-bold p-6 px-8 rounded-md text-xl text-white ${sofia.className}`}>
              Preguntas frecuentes
            </button>
          </Link>
        </div>
      </div>
      </div>
        <div className="m-1 mb-20 bg-rose-50 py-6">
          <Link href="/enduser/conocenuestrosproductos">
            <h2 className={`m-6 text-center text-4xl ${sofia.className}`}>
              Conoce Nuestros Productos
            </h2>
          </Link>
          <div className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row items-center md:flex-row md:mt-10 md:justify-center gap-10 font-bold">
            <div className="">
              <div className="flex justify-center">
                <Image
                  className="w-52 h-52 rounded-full"
                  src="/img/sabores.jpeg"
                  width={190}
                  height={190}
                  alt="foto de flan de sabores"
                />
              </div>
              <div className="saboresDescription text-center pt-1 md:pt-3 text-lg m-4">
                Nuestros Sabores
              </div>
            </div>
            <div className="postresContainer">
              <div className="flex justify-center">
                <Image
                  className="w-52 h-52 rounded-full"
                  src="/img/pay.jpeg"
                  width={190}
                  height={190}
                  alt="foto de flan de sabores"
                />
              </div>
              <div className="postresDescription text-center pt-1 md:pt-3 text-lg m-4">
                Postres
              </div>
            </div>
            <div className="pastelesContainer">
              <div className="flex justify-center">
                <Image
                  className="w-52 h-52 rounded-full"
                  src="/img/yoda.jpg"
                  width={190}
                  height={190}
                  alt="Foto de pastel 3d yoda"
                />
              </div>
              <div className="pastelesDescription text-center pt-1 md:pt-3 text-lg m-4">
                Pasteles 3D
              </div>
            </div>
            <div className="galletasContainer">
              <div className="flex justify-center">
                <Image
                  className="w-52 h-52 rounded-full"
                  src="/img/coockies.jpg"
                  width={500}
                  height={500}
                  alt="Foto de galletas americanas"
                />
              </div>
              <div className="galletasDescription text-center pt-1 md:pt-3 text-lg m-4">
                Galletas Americanas
              </div>
            </div>
          </div>
        </div>
        <div className="md:flex m-10 mb-20 gap-4">
          <div className="md:w-1/2 mb-8">
            <div className="text-center text-3xl my-4">
              <h2 className={`text-center text-4xl ${sofia.className}`}>Conocenos</h2>
            </div>
            <div className="text-center text-lg">
              <p>
                ¡Bienvenidos a Pastelería El Ruiseñor! Nos encanta añadir ese
                toque dulce a tus eventos y ocasiones especiales con diseños
                personalizados que se adaptan a tus necesidades. Estamos
                ubicados en el hermoso Guadalajara, Jalisco.
              </p>
            </div>
            <div className="text-center my-10px text-lg">
              <Link href="/enduser/conocenos">
                <button>
                  <p>Leer más...</p>
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:w-1/2">
            <Image
              className="rounded-xl"
              src="/img/pasteleslanding.png"
              width={450}
              height={450}
              alt="foto de flan de sabores"
            />
          </div>
        </div>
      </main>
      <WebFooter />
    </main>
  );
}
