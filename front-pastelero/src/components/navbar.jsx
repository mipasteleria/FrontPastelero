import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const NavbarAdmin = () => {
  return (
    <nav className={`bg-primary h-16 ${sofia.className} text-text`}>
      <div className="flex flex-row justify-between items-center">
      <div className="flex">
          <Link href="/">
            <Image 
                className="mx-2"
                src="/img/logo.JPG"
                width={64}
                height={64}
                alt="logo de Pastelería El Ruiseñor"
              />
           </Link>
          <div className="hidden md:block">
            <div className="text-white px-2">
              Pastelería
            </div>
            <div className="text-white text-4xl px-2">
              El Ruiseñor
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex">
            <Link href="/conocenuestrosproductos">
              <div className={`${poppins.className} m-4 hidden md:flex`}>
                Productos
              </div>
            </Link>
            <Link href="/galeria">
              <div className={`${poppins.className} m-4 hidden md:flex`}>
                Galeria
              </div>
            </Link>
            <Link href="/login">
              <div className={`${poppins.className} m-4 hidden md:flex`}>
                Log In
              </div>
            </Link>
            <Link href="/login">
              <div className={`${poppins.className} md:m-2 bg-text text-white rounded-xl p-2 m-2 md:px-3 md:py-2`}>
                ¡Cotizar ahora!
              </div>
            </Link>
          </div>
          <div className="m-4 gap-4 hidden lg:flex">
            <Link href="/carrrito">
              <svg className="w-6 h-6 text-text dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
              </svg>
            </Link>
            <Link href="/preguntasfrecuentes">
              <svg className="w-6 h-6 text-text dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.48-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z" clip-rule="evenodd"/>
              </svg>
            </Link>
          </div>
        </div>
        
      </div>
    </nav>
  );
};
export default NavbarAdmin;
