import Image from "next/image";
import WebFooter from "@/src/components/WebFooter";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";

export default function Home() {
  return (
    <main>
      <NavbarAdmin />
      <Link href="/dashboard">
        <button className="btnIntroductionLogIn">Dashboard</button>
      </Link>
      <div className="bg-background text-text">
        <div className="landingTop flex gap-[20px] my-[100px] mx-[200px] px-[200px]">
          <div className="landingTopVideo basis-1/2">
            <Image
              className="rounded-xl "
              src="/img/videolanding.png"
              width={800}
              height={800}
              alt="video que no es video"
            />
          </div>
          <div className="landingTopText basis-1/2 flex flex-col justify-center gap-10">
            <div>
              <h1 className="text-center text-4xl">Horneando Recuerdos</h1>
            </div>
            <div>
              <p className="text-center text-lg">
                ¿Cuántos de tus recuerdos más preciados incluyen un delicioso
                pastel? En nuestra pastelería, ofrecemos calidad y
                personalización en cada pastel. Visita nuestra galería para
                admirar nuestros diseños y descubrir la calidad que nos
                distingue. ¡Convierte tus momentos especiales en experiencias
                inolvidables!
              </p>
            </div>
            <div className="flex justify-center">
              <button className="bg-primary text-xl py-5 px-40 rounded-md">
                ¡COTIZA HOY MISMO!
              </button>
            </div>
          </div>
        </div>
        <div className="landingMiddle my-[100px]">
          <Link href="/enduser/conocenuestrosproductos">
            <h2 className="text-center text-4xl ">Conoce Nuestros Productos</h2>
          </Link>
          <div className="MiddleProductsContainer flex gap-[100px] mt-10 justify-center">
            <div className="saboresContainer">
              <div className="saboresImg w-[190px] h-[190px] rounded-full overflow-hidden">
                <Image
                  className="w-[190px] h-[200px]"
                  src="/img/sabores.jpeg"
                  width={190}
                  height={190}
                  alt="foto de flan de sabores"
                />
              </div>
              <div className="saboresDescription text-center pt-3 text-lg">
                Nuestros Sabores
              </div>
            </div>
            <div className="postresContainer">
              <div className="postresImg w-[190px] h-[190px] rounded-full overflow-hidden">
                <Image
                  className="w-[190px] h-[200px]"
                  src="/img/pay.jpeg"
                  width={190}
                  height={190}
                  alt="foto de flan de sabores"
                />
              </div>
              <div className="postresDescription text-center pt-3 text-lg">
                Postres
              </div>
            </div>
            <div className="pastelesContainer">
              <div className="pastelesImg h-[190px] w-[190px] rounded-full overflow-hidden">
                <Image
                  src="/img/yoda.jpg"
                  width={190}
                  height={190}
                  alt="Foto de pastel 3d yoda"
                />
              </div>
              <div className="pastelesDescription text-center pt-3 text-lg">
                Pasteles 3D
              </div>
            </div>
            <div className="galletasContainer">
              <div className="galletasImg w-[190px] h-[190px] rounded-full overflow-hidden">
                <Image
                  className="w-[190px] h-[190px]"
                  src="/img/coockies.jpg"
                  width={500}
                  height={500}
                  alt="Foto de galletas americanas"
                />
              </div>
              <div className="galletasDescription text-center pt-3 text-lg">
                Galletas Americanas
              </div>
            </div>
          </div>
        </div>
        <div className="landingBottom flex gap-[20px] my-[100px] mx-[200px] px-[200px]">
          <div className="landingBottomTexto basis-1/2 flex flex-col justify-center gap-10">
            <div className="text-center text-4xl">
              <h2>Conocenos</h2>
            </div>
            <div className="text-center text-lg">
              <p>
                ¡Bienvenidos a Pastelería El Ruiseñor! Nos encanta añadir ese
                toque dulce a tus eventos y ocasiones especiales con diseños
                personalizados que se adaptan a tus necesidades. Estamos
                ubicados en el hermoso Guadalajara, Jalisco.
              </p>
            </div>
            <div className="text-center text-lg">
              <button>
                <p>Leer más...</p>
              </button>
            </div>
          </div>
          <div className="landingBottomImg basis-1/2 flex justify-center pl-[200px]">
            <Image
              className="rounded-xl"
              src="/img/pasteleslanding.png"
              width={450}
              height={450}
              alt="foto de flan de sabores"
            />
          </div>
        </div>
      </div>
      <WebFooter />
    </main>
  );
}
