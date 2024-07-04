import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const NavbarAdmin = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest("#dropdownMenu") && !event.target.closest("#menuButton")) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className={`bg-primary h-16 ${sofia.className} text-text relative z-50`}>
      <div className="flex flex-row justify-between items-center">
        <div className="flex">
          <button id="menuButton" className="block md:hidden" onClick={toggleDropdown}>
            <svg className="w-8 h-8 text-white m-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
            </svg>
          </button>
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
            <Link href="/registrarse">
              <div className={`${poppins.className} m-4 hidden md:flex`}>
                Registrarse
              </div>
            </Link>
            <Link href="/enduser/conocenuestrosproductos">
              <div className={`${poppins.className} m-4 hidden md:flex`}>
                Productos
              </div>
            </Link>
            <Link href="/galeria">
              <div className={`${poppins.className} m-4 hidden lg:flex`}>
                Galeria
              </div>
            </Link>
            <Link href="/login">
              <div className={`${poppins.className} m-4 hidden md:flex`}>
                Log In
              </div>
            </Link>
            <Link href="/enduser/solicitarcotizacion">
              <div className={`${poppins.className} md:m-2 bg-text text-white rounded-xl p-2 m-2 md:px-3 md:py-2 ${dropdownOpen ? 'hidden' : 'block'}`}>
                ¡Cotizar ahora!
              </div>
            </Link>
          </div>
          <div className="m-4 gap-4 hidden lg:flex">
            <Link href="/carrito">
              <svg className="w-6 h-6 text-text dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
              </svg>
            </Link>
            <Link href="/preguntasfrecuentes">
              <svg className="w-6 h-6 text-text dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.48-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      {dropdownOpen && (
        <div
          id="dropdownMenu"
          className="z-60 fixed left-0 top-0 bottom-0 w-4/5 h-full bg-primary/80 backdrop-blur-sm text-text rounded-lg shadow-2xl p-4 md:hidden"
        >
          <button className="absolute top-4 right-4" onClick={toggleDropdown}>
            <svg className="w-8 h-8 text-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Link href="/registrarse">
            <div className={`${poppins.className} m-6 text-lg`}>
              Registrarse
            </div>
          </Link>
          <Link href="/enduser/conocenuestrosproductos">
            <div className={`${poppins.className} m-6 text-lg`}>
              Productos
            </div>
          </Link>
          <Link href="/galeria">
            <div className={`${poppins.className} m-6 text-lg`}>
              Galeria
            </div>
          </Link>
          <Link href="/login">
            <div className={`${poppins.className} m-6 text-lg`}>
              Log In
            </div>
          </Link>
          <Link href="/enduser/solicitarcotizacion">
            <div className={`${poppins.className} m-6 bg-text text-white rounded-xl p-2 text-lg`}>
              ¡Cotizar ahora!
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavbarAdmin;
