import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context";
import { CartContext } from "./enuser/carritocontext";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });



const NavbarAdmin = () => {
  const { isAdmin, setIsAdmin, isLoggedIn, setIsLoggedIn, userEmail, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { asPath } = router;

const cart = useContext(CartContext);
const productsCount = cart.items.reduce((sum, product) => sum + product.quantity, 0);
console.log(cart.items);
console.log("product count" & productsCount);

  const handleNavigation = () => {
    router.push('/dashboard');
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        !event.target.closest("#dropdownMenu") &&
        !event.target.closest("#menuButton")
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);
  const navigate = () => {
    router.push('/');
  };

  const handleLogout = () => {
    const currentIsAdmin = isAdmin; 
  
    logout("token");
  
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has salido de tu cuenta correctamente.',
      icon: 'success',
      background: '#fff1f2',
      color: '#540027',
      confirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    }).then(() => {
      setIsLoggedIn(false);
      setIsAdmin(false);

      if (currentIsAdmin) {
        router.push("/");
      }
    });
  };
  
  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-primary h-16 ${sofia.className} text-text z-50 shadow-lg`}
    >
      <div 
      className="flex flex-row justify-between items-center">
        <div 
        className="flex">
          <button
            id="menuButton"
            className="block md:hidden"
            onClick={toggleDropdown}
          >
            <svg
              className="w-8 h-8 text-white m-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M5 7h14M5 12h14M5 17h14"
              />
            </svg>
          </button>
          <Link 
          href="/">
            <button 
            className="mx-2 cursor-pointer">
              <Image
                src="/img/logo.JPG"
                width={64}
                height={64}
                alt="logo de Pastelería El Ruiseñor"
              />
            </button>
          </Link>
          <div 
          className="hidden md:block">
            <div 
            className="text-white px-2">Pastelería</div>
            <div 
            className="text-white text-4xl px-2">El Ruiseñor</div>
          </div>
        </div>
        <div 
        className="flex items-center gap-4">
          {isLoggedIn ? (
            isAdmin ? (
              <div className="w-full hidden md:flex justify-end">
                <div
                  className={`${poppins.className} m-4 hidden lg:flex cursor-pointer`}
                >
                  {userEmail}
                </div>
                {asPath.startsWith("/dashboard") ? null : (
                  <Link href="/dashboard">
                    <button
                      className={`${poppins.className} md:m-2 bg-text text-white rounded-xl p-2 m-2 md:px-3 md:py-2 cursor-pointer`}
                    >
                      Dashboard
                    </button>
                  </Link>
                )}
                <button
                  className={`${poppins.className} mx-4 h-10 bg-text text-white rounded-xl p-1 mt-2 md:px-2 md:py-1 cursor-pointer`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
            </div>
            ) : (
              <div 
              className="flex">
                <div
                  className={`${poppins.className} m-4 hidden lg:flex cursor-pointer`}
                >
                  {userEmail}
                </div>
                <Link 
                href="/enduser/mispedidos">
                  <button
                    className={`${poppins.className} m-4 hidden md:flex cursor-pointer`}
                  >
                    Mis Pedidos
                  </button>
                </Link>
                <Link 
                href="/cotizacion">
                  <div
                    className={`${
                      poppins.className
                    } md:m-2 bg-text text-white rounded-xl p-2 m-2 md:px-3 md:py-2 cursor-pointer ${
                      dropdownOpen ? "hidden" : "block"
                    }`}
                  >
                    ¡Cotizar ahora!
                  </div>
                </Link>
                <button
                  className={`${poppins.className} hidden md:flex h-10 bg-text text-white rounded-xl p-1 mt-2 md:px-2 md:py-1 cursor-pointer`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <Link href="/enduser/carrito">
                <button 
                   
                    className={`${poppins.className} m-4 hidden md:flex cursor-pointer text-text`}
                  >
                     ({productsCount})
                    <svg
                      className="w-8 h-8"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                      />
                    </svg>
                  </button>
                </Link>
                <Link href="/enduser/conocenos#preguntasfrecuentes">
                  <button
                    className={`${poppins.className} m-4 hidden lg:flex cursor-pointer text-text`}
                  >
                    <svg
                      className="w-8 h-8"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            )
          ) : (
            <div className="flex">
              <Link href="/registrarse">
                <button
                  className={`${poppins.className} m-4 hidden md:flex cursor-pointer`}
                >
                  Registrarse
                </button>
              </Link>
              <Link href="/enduser/conocenuestrosproductos">
                <button
                  className={`${poppins.className} m-4 hidden md:flex cursor-pointer`}
                >
                  Productos
                </button>
              </Link>
              <Link href="/enduser/galeria">
                <button
                  className={`${poppins.className} m-4 hidden lg:flex cursor-pointer`}
                >
                  Galería
                </button>
              </Link>
              <Link href="/login">
                <button
                  className={`${poppins.className} m-4 hidden md:flex cursor-pointer`}
                >
                  Log In
                </button>
              </Link>
              <Link href="/cotizacion">
                <div
                  className={`${
                    poppins.className
                  } md:m-2 bg-text text-white rounded-xl p-2 m-2 md:px-3 md:py-2 cursor-pointer ${
                    dropdownOpen ? "hidden" : "block"
                  }`}
                >
                  ¡Cotizar ahora!
                </div>
              </Link>
              <Link href="/enduser/conocenos#preguntasfrecuentes">
                <button
                  className={`${poppins.className} m-4 hidden lg:flex cursor-pointer`}
                >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {dropdownOpen && (
        <div
          id="dropdownMenu"
          className="z-60 fixed left-0 top-0 bottom-0 w-11/12 h-full bg-primary/80 backdrop-blur-lg text-text rounded-lg shadow-2xl p-4 md:hidden"
        >
          <button 
          className="absolute top-4 right-4" 
          onClick={toggleDropdown}>
            <svg
              className="w-8 h-8 text-text"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {isLoggedIn ? (
            isAdmin ? (
              <div className="flex flex-col mt-10">
                <div
                  className={`${poppins.className} my-4 text-sm cursor-pointer`}
                >
                  {userEmail}
                </div>
                <button
                onClick={handleNavigation}
                className={`${poppins.className} h-10 bg-text text-white rounded-xl p-1 my-4 md:px-2 md:py-1 cursor-pointer`}
                >
                  Dashboard
                </button>
                <button
                  className={`${poppins.className} h-10 bg-text text-white rounded-xl p-1 my-4 md:px-2 md:py-1 cursor-pointercursor-pointer`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
            </div>
            ) : ( 
              <div 
              className="flex flex-col">
                <Link 
                  href="/enduser/conocenuestrosproductos">
                    <button
                      className={`${poppins.className} m-6 font-bold rounded-xl p-2 text-lg cursor-pointer`}
                    >
                      Productos
                    </button>
                  </Link>
                  <Link 
                  href="/enduser/galeria">
                    <button
                      className={`${poppins.className} m-6 font-bold rounded-xl p-2 text-lg cursor-pointer`}
                    >
                      Galería
                    </button>
                  </Link>
                  <Link 
                  href="/enduser/detallesolicitud">
                    <button
                      className={`${poppins.className} m-6 font-bold rounded-xl p-2 text-lg cursor-pointer`}
                    >
                      Mis Pedidos
                    </button>
                  </Link>
                  <button
                    className={`${poppins.className} flex justify-start m-6 font-bold rounded-xl p-2 text-lg cursor-pointer`}
                    onClick={handleLogout}                  
                  >
                    LogOut
                  </button>
                  <Link 
                  href="/cotizacion">
                    <button
                      className={`${poppins.className} m-6 bg-text text-white rounded-xl p-2 text-lg cursor-pointer`}
                    >
                      ¡Cotizar ahora!
                    </button>
                  </Link>
                  <div 
                  className="flex flex-row text-text mx-6">
                    <Link 
                    href="/enduser/carrito">
                      <button 
                    
                    className={`${poppins.className} m-4 hidden md:flex cursor-pointer text-text`}
                  >
                     ({productsCount})
                        <svg
                          className="w-8 h-8"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                          />
                        </svg>
                      </button>
                    </Link>
                    <Link 
                    href="/enduser/conocenos#preguntasfrecuentes">
                      <button
                        className={`${poppins.className} m-4 cursor-pointer`}
                      >
                        <svg
                          className="w-8 h-8"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </Link>
                </div>
              </div>
            )
          ) : (
            <div 
            className="flex flex-col font-bold">
              <Link 
              href="/registrarse">
                <button
                  className={`${poppins.className} m-6 text-lg cursor-pointer`}
                >
                  Registrarse
                </button>
              </Link>
              <Link 
              href="/enduser/conocenuestrosproductos">
                <button
                  className={`${poppins.className} m-6 text-lg cursor-pointer`}
                >
                  Productos
                </button>
              </Link>
              <Link 
              href="/enduser/galeria">
                <button
                  className={`${poppins.className} m-6 text-lg cursor-pointer`}
                >
                  Galería
                </button>
              </Link>
              <Link 
              href="/login">
                <button
                  className={`${poppins.className} m-6 text-lg cursor-pointer`}
                >
                  Log In
                </button>
              </Link>
              <Link 
              href="/enduser/conocenos#preguntasfrecuentes">
                <button
                  className={`${poppins.className} m-6 text-lg cursor-pointer`}
                >
                  Preguntas frecuentes
                </button>
              </Link>
              <Link 
              href="/cotizacion">
                <button
                  className={`${poppins.className} m-6 bg-text text-white rounded-xl p-2 text-lg cursor-pointer font-normal`}
                >
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