import Image from "next/image";
import WebFooter from "@/src/components/WebFooter";

export default function Home() {
  return (
    <main classname="landingMain">
      <div className="landingContainer bg-[#FFF3F5] text-[#540027]">
        <div className="landingTop flex justify-center align-middle pt-10 gap-10">
          <div className="landingTopVideo basis-1/2 justify-center align-middle bg-black"></div>
          <div className="landingTopText basis-1/2 flex-col max-w-[533px]">
            <div>
              <h1 className="text-center text-4xl">Horneando Recuerdos</h1>
            </div>
            <div>
              <p className="text-center m-12 text-lg">
                ¿Cuántos de tus recuerdos más preciados incluyen un delicioso
                pastel? En nuestra pastelería, ofrecemos calidad y
                personalización en cada pastel. Visita nuestra galería para
                admirar nuestros diseños y descubrir la calidad que nos
                distingue. ¡Convierte tus momentos especiales en experiencias
                inolvidables!
              </p>
            </div>
            <div className="flex justify-center align-middle">
              <button className="bg-[#FFC3C9] text-xl py-5 px-40 rounded-md">
                ¡COTIZA HOY MISMO!
              </button>
            </div>
          </div>
        </div>
        <div className="landingMiddle">
          <h2 className="text-center text-4xl mt-10">
            Conoce Nuestros Productos
          </h2>
          <div className="MiddleProductsContainer flex gap-12 mt-10 justify-center">
            <div className="saboresContainer">
              <div className="saboresImg w-[190px] h-[190px] bg-black rounded-full"></div>
              <div className="saboresDescription text-center pt-3 text-lg">
                Nuestros Sabores
              </div>
            </div>
            <div className="postresContainer">
              <div className="postresImg w-[190px] h-[190px] bg-black rounded-full"></div>
              <div className="postresDescription text-center pt-3 text-lg">
                Postres
              </div>
            </div>
            <div className="pastelesContainer">
              <div className="pastelesImg h-[190px] w-[190px] rounded-full overflow-hidden ">
                <Image
                  src="/yoda.jpg"
                  width={190}
                  height={190}
                  alt="Picture of 3d yoda cake"
                />
              </div>
              <div className="pastelesDescription text-center pt-3 text-lg">
                Pasteles 3D
              </div>
            </div>
            <div className="galletasContainer">
              <div className="galletasImg w-[190px] h-[190px] bg-black rounded-full"></div>
              <div className="galletasDescription text-center pt-3 text-lg">
                Galletas Americanas
              </div>
            </div>
          </div>
        </div>
        <div className="landingBottom flex mt-[53px]">
          <div className="landingBottomTexto basis-1/2">
            <div className="text-center text-4xl mt-[100px] mb-[42px]">
              <h2>Conocenos</h2>
            </div>
            <div className="text-center ml-[65px] mr-[128px] text-lg">
              <p>
                ¡Bienvenidos a Pastelería El Ruiseñor! Nos encanta añadir ese
                toque dulce a tus eventos y ocasiones especiales con diseños
                personalizados que se adaptan a tus necesidades. Estamos
                ubicados en el hermoso Guadalajara, Jalisco.
              </p>
            </div>
            <div className="text-center pt-[33px] text-lg">
              <p>Leer más...</p>
            </div>
          </div>
          <div className="landingBottomImg basis-1/2 w-[450px] h-[450px] bg-black"></div>
        </div>
      </div>
      <WebFooter />
    </main>
  );
}
