import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context';
import { Poppins as PoppinsFont, Sofia as SofiaFont } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';

const poppins = PoppinsFont({ subsets: ['latin'], weight: ['400', '700'] });
const sofia = SofiaFont({ subsets: ['latin'], weight: ['400'] });

const NavbarAdmin = () => {
  const { isAdmin, isLoggedIn } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('#dropdownMenu') && !event.target.closest('#menuButton')) {
        closeDropdown();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className={`fixed top-0 left-0 w-full bg-primary h-16 ${sofia.className} text-text z-50 shadow-lg`}>
      <div className="flex flex-row justify-between items-center">
        <div className="flex">
          <button id="menuButton" className="block md:hidden" onClick={toggleDropdown}>
            <svg
              className="w-8 h-8 text-white m-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
            </svg>
          </button>
          <Link href="/">
            <button className="mx-2 cursor-pointer">
              <Image src="/img/logo.JPG" width={64} height={64} alt="logo de Pastelería El Ruiseñor" />
            </button>
          </Link>
          <div className="hidden md:block">
            <div className="text-white px-2">Pastelería</div>
            <div className="text-white text-4xl px-2">El Ruiseñor</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            isAdmin ? (
              <Link href="/admin/dashboard">
                <button className={`${poppins.className} md:m-2 bg-text text-white rounded-xl p-2 m-2 md:px-3 md:py-2 cursor-pointer`}>
                  Dashboard
                </button>
              </Link>
            ) : (
              <div className="flex">
                <div className={`${poppins.className} m-4 hidden lg:flex cursor-pointer`}>
                  jalbores339@gmail.com
                </div>
                <Link href="/registrarse">
                  <button className={`${poppins.className} m-4 hidden md:flex cursor-pointer`}>
                    Mis Pedidos
                  </button>
                </Link>
                <Link href="/enduser/solicitarcotizacion">
                  <div
                    className={`${poppins.className} md:m-2 bg-text text-white rounded-xl p-2 m-2 md:px-3 md:py-2 cursor-pointer ${
                      dropdownOpen ? 'hidden' : 'block'
                    }`}>
                    ¡Cotizar ahora!
                  </div>
                </Link>
              </div>
            )
          ) : (
            <div className="flex">
              <Link href="/registrarse">
                <button className={`${poppins.className} m-4 hidden md:flex cursor-pointer`}>
                  Registrarse
                </button>
              </Link>
              <Link href="/enduser/conocenuestrosproductos">
                <button className={`${poppins.className} m-4 hidden md:flex cursor-pointer`}>
                  Productos
                </button>
              </Link>
              <Link href="/enduser/galeria">
                <button className={`${poppins.className} m-4 hidden lg:flex cursor-pointer`}>
                  Galería
                </button>
              </Link>
              <Link href="/login">
                <button className={`${poppins.className} m-4 hidden md:flex cursor-pointer`}>
                  Log In
                </button>
              </Link>
              <Link href="/enduser/solicitarcotizacion">
                <div
                  className={`${poppins.className} md:m-2 bg-text text-white rounded-xl p-2 m-2 md:px-3 md:py-2 cursor-pointer ${
                    dropdownOpen ? 'hidden' : 'block'
                  }`}
                >
                  ¡Cotizar ahora!
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      {dropdownOpen && (
        <div
          id="dropdownMenu"
          className="z-60 fixed left-0 top-0 bottom-0 w-4/5 h-full bg-primary/80 backdrop-blur-sm text-text rounded-lg shadow-2xl p-4 md:hidden"
        >
          <button className="absolute top-4 right-4" onClick={toggleDropdown}>
            <svg
              className="w-8 h-8 text-text"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {isLoggedIn ? (
            isAdmin ? (
              <Link href="/admin/dashboard">
                <button className={`${poppins.className} m-6 bg-text text-white rounded-xl p-2 text-lg cursor-pointer`}>
                  Dashboard
                </button>
              </Link>
            ) : (
              <div>
                <Link href="/user/orders">
                  <button className={`${poppins.className} m-6 font-bold rounded-xl p-2 text-lg cursor-pointer`}>
                    Mis Pedidos
                  </button>
                </Link>
                <Link href="/enduser/solicitarcotizacion">
                  <button className={`${poppins.className} m-6 bg-text text-white rounded-xl p-2 text-lg cursor-pointer`}>
                    ¡Cotizar ahora!
                  </button>
                </Link>
              </div>
            )
          ) : (
            <div className="flex flex-col font-bold">
              <Link href="/registrarse">
                <button className={`${poppins.className} m-6 text-lg cursor-pointer`}>
                  Registrarse
                </button>
              </Link>
              <Link href="/enduser/conocenuestrosproductos">
                <button className={`${poppins.className} m-6 text-lg cursor-pointer`}>
                  Productos
                </button>
              </Link>
              <Link href="/enduser/galeria">
                <button className={`${poppins.className} m-6 text-lg cursor-pointer`}>
                  Galería
                </button>
              </Link>
              <Link href="/login">
                <button className={`${poppins.className} m-6 text-lg cursor-pointer`}>
                  Log In
                </button>
              </Link>
              <Link href="/enduser/solicitarcotizacion">
                <button className={`${poppins.className} m-6 bg-text text-white rounded-xl p-2 text-lg cursor-pointer font-normal`}>
                  ¡Cotizar ahora!
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarAdmin;
