import Image from "next/image";
import WebFooter from "@/src/components/WebFooter";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";

export default function Home() {
  return (
    <main>
      <NavbarAdmin />
      <Link href="/conocenuestrosproductos">
        <button className="btnIntroductionLogIn">
          Conoce nuestro productos
        </button>
      </Link>
      <Link href="/dashboard">
        <button className="btnIntroductionLogIn">Dashboard</button>
      </Link>
      <div className="bg-background text-text">
        <div className="landingTop m-[10px] md:flex md:gap-[40px] md:my-[100px] md:mx-[200px] md:px-[200px]">
          <div className="landingTopVideo  md:basis-1/2 flex justify-center">
            <Image
              className="md:rounded-xl md:h-[400px] "
              src="/img/videolanding.png"
              width={350}
              height={350}
              alt="video que no es video"
            />
          </div>
          <div className="landingTopText mt-[20px] md:basis-1/2 md:flex md:flex-col md:justify-center md:gap-10">
            <div>
              <h1 className="text-center pb-[10px] text-2xl md:text-4xl">
                Horneando Recuerdos
              </h1>
            </div>
            <div>
              <p className="text-center text-lg mb-[20px]">
                ¿Cuántos de tus recuerdos más preciados incluyen un delicioso
                pastel? En nuestra pastelería, ofrecemos calidad y
                personalización en cada pastel. Visita nuestra galería para
                admirar nuestros diseños y descubrir la calidad que nos
                distingue. <br /> ¡Convierte tus momentos especiales en
                experiencias inolvidables!
              </p>
            </div>
            <div className="flex justify-center">
              <button className="bg-primary text-xl py-1 md:py-5 px-[65px] md:px-40 rounded-md">
                ¡COTIZA HOY MISMO!
              </button>
            </div>
          </div>
        </div>
        <div className="landingMiddle md:my-[100px]">
          <h2 className="text-center text-2xl mt-[50px] mb-[20px] md:text-4xl ">
            Conoce Nuestros Productos
          </h2>
          <div className="MiddleProductsContainer flex flex-col items-center md:flex-row gap-[20px] md:gap-[100px] md:mt-10 md:justify-center">
            <div className="saboresContainer">
              <div className="saboresImg w-[190px] h-[190px] rounded-full overflow-hidden">
                <Image
                  className="w-[190px] h-[190px]"
                  src="/img/sabores.jpeg"
                  width={190}
                  height={190}
                  alt="foto de flan de sabores"
                />
              </div>
              <div className="saboresDescription text-center pt-1 md:pt-3 text-lg">
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
              <div className="postresDescription text-center pt-1 md:pt-3 text-lg">
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
              <div className="pastelesDescription text-center pt-1 md:pt-3 text-lg">
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
              <div className="galletasDescription text-center pt-1 md:pt-3 text-lg">
                Galletas Americanas
              </div>
            </div>
          </div>
        </div>
        <div className="landingBottom md:flex md:gap-[20px] md:my-[100px] md:mx-[200px] md:px-[200px]">
          <div className="landingBottomTexto md:basis-1/2 md:flex md:flex-col md:justify-center md:gap-10">
            <div className="text-center text-2xl mt-[50px] md:text-4xl">
              <h2>Conocenos</h2>
            </div>
            <div className="text-center mt-[10px] text-lg">
              <p>
                ¡Bienvenidos a Pastelería El Ruiseñor! Nos encanta añadir ese
                toque dulce a tus eventos y ocasiones especiales con diseños
                personalizados que se adaptan a tus necesidades. Estamos
                ubicados en el hermoso Guadalajara, Jalisco.
              </p>
            </div>
            <div className="text-center my-[10px] text-lg">
              <Link href="/enduser/conocenos">
                <button>
                  <p>Leer más...</p>
                </button>
              </Link>
            </div>
          </div>
          <div className="landingBottomImg flex justify-center mb-[20px] md:mb-[0px] md:basis-1/2 md:flex md:justify-center md:pl-[200px]">
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
