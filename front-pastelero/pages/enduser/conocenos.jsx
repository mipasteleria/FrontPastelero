import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import { useState } from "react";
import WebFooter from "@/src/components/WebFooter";
import Link from "next/link";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenos() {
  const [openSection, setOpenSection] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const isSectionOpen = (section) => {
    return openSection === section;
  };

  return (
    <div>
      <NavbarAdmin />
      <main 
      className="flex flex-col items-center gap-8 md:gap-30 pt-8 md:pt-30 max-w-screen-lg mx-auto mt-16">
        <div 
        className="flex flex-col md:flex-row items-center">
          <div 
          className="photoContainer w-full md:w-1/4 flex justify-center md:ml-6">
            <Image
              className="rounded-xl"
              src="/img/conocenosPastelera.png"
              width={270}
              height={391}
              layout="responsive"
              alt="pastelera posando con un pastel"
              priority
            />
          </div>
          <div 
          className="textoConocenosContainer p-8 md:p-30 w-full md:w-3/4 bg-rose-50 rounded-lg text-text m-6">
            <div 
            className="titleConocenos text-4xl">
              <h1 
              className={`text-4xl m-6 ${sofia.className}`}>Conocenos</h1>
            </div>
            <div 
            className="descripcionTextoConocenos text-lg mt-6">
              <p>
                Pastelería El Ruiseñor nació en 2015, cuando nuestra fundadora,
                Ana González, estaba cursando la carrera de Ingeniería
                Mecatrónica. Su pasión por los pasteles y la necesidad de
                encontrar un apoyo económico extra hicieron que un sueño se
                convirtiera en realidad.
              </p>
              <p 
              className="mt-6">
                Nos sentimos afortunados de estar en constante capacitación,
                siempre aprendiendo y aplicando las técnicas más actuales y de
                tendencia en el mundo pastelero.
              </p>
              <p 
              className="mt-6">
                En lugar de copiar pasteles de una imagen, preferimos
                personalizarlos especialmente para ti. Permítenos la oportunidad
                de maravillar tu fiesta y a tus invitados con un diseño único y
                hecho a tu medida.
              </p>
              <p 
              className="mt-6">
                ¡Será un placer ser parte de tus momentos más dulces!
              </p>
            </div>
          </div>
        </div>
        <div
          id="preguntasfrecuentes"
          className="flex flex-col md:flex-row gap-8 md:gap-30 p-6 mt-0"
        >
          <div 
          className="textoConocenosContainer md:p-30 w-full md:w-3/4 rounded-lg text-text">
            <div
              className="accordion p-4"
              id="accordion-open"
              data-accordion="open"
            >
              <h2 
              className={`text-4xl m-6 ${sofia.className}`}>
                Preguntas frecuentes
              </h2>
              <h2 
              id="accordion-open-heading-1">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right shadow-md rounded-t-xl bg-white hover:bg-accent hover:text-white gap-3"
                  data-accordion-target="#accordion-open-body-1"
                  aria-expanded={isSectionOpen(1)}
                  aria-controls="accordion-open-body-1"
                  onClick={() => toggleSection(1)}
                >
                  <span className="flex items-center text-xl">
                    ¿Cómo puedo hacer un pedido?
                  </span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 ${
                      isSectionOpen(1) ? "" : "rotate-180"
                    } shrink-0`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-open-body-1"
                className={`${isSectionOpen(1) ? "" : "hidden"}`}
                aria-labelledby="accordion-open-heading-1"
              >
                <div className="p-5 bg-white">
                  <p className="mb-2">
                    Puedes hacer un pedido a través de nuestro sitio web, por
                    correo electrónico o llamándonos directamente.
                  </p>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />

              <h2 id="accordion-open-heading-2">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right shadow-md bg-white hover:bg-accent hover:text-white gap-3"
                  data-accordion-target="#accordion-open-body-2"
                  aria-expanded={isSectionOpen(2)}
                  aria-controls="accordion-open-body-2"
                  onClick={() => toggleSection(2)}
                >
                  <span className="flex items-center text-xl">
                    ¿Con cuánta anticipación debo hacer mi pedido?
                  </span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 ${
                      isSectionOpen(2) ? "" : "rotate-180"
                    } shrink-0`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-open-body-2"
                className={`${isSectionOpen(2) ? "" : "hidden"}`}
                aria-labelledby="accordion-open-heading-2"
              >
                <div className="p-5 bg-white">
                  <p className="mb-2">
                    Recomendamos hacer tu pedido al menos 2 semanas antes de la
                    fecha de entrega deseada.
                  </p>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />

              <h2 id="accordion-open-heading-3">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right shadow-md bg-white hover:bg-accent hover:text-white gap-3"
                  data-accordion-target="#accordion-open-body-3"
                  aria-expanded={isSectionOpen(3)}
                  aria-controls="accordion-open-body-3"
                  onClick={() => toggleSection(3)}
                >
                  <span className="flex items-center text-xl">
                    ¿Ofrecen entregas a domicilio?
                  </span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 ${
                      isSectionOpen(3) ? "" : "rotate-180"
                    } shrink-0`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-open-body-3"
                className={`${isSectionOpen(3) ? "" : "hidden"}`}
                aria-labelledby="accordion-open-heading-3"
              >
                <div className="p-5 bg-white">
                  <p className="mb-2">
                    Sí, ofrecemos servicio de entrega a domicilio en Guadalajara
                    Jalisco y sus alrededores. Se aplican cargos adicionales
                    según la distancia, estos son considerados en la cotizacion.
                  </p>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />

              <h2 id="accordion-open-heading-4">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right shadow-md bg-white hover:bg-accent hover:text-white gap-3"
                  data-accordion-target="#accordion-open-body-4"
                  aria-expanded={isSectionOpen(4)}
                  aria-controls="accordion-open-body-4"
                  onClick={() => toggleSection(4)}
                >
                  <span className="flex items-center text-xl">
                    ¿Puedo personalizar el diseño y sabor del pastel?
                  </span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 ${
                      isSectionOpen(4) ? "" : "rotate-180"
                    } shrink-0`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-open-body-4"
                className={`${isSectionOpen(4) ? "" : "hidden"}`}
                aria-labelledby="accordion-open-heading-4"
              >
                <div className="p-5 bg-white">
                  <p className="mb-2">
                    Sí, puedes personalizar tanto el diseño como el sabor del
                    pastel llenando el formulario, donde nos podrás compartir
                    tus ideas y haremos lo posible por realizarlas.
                  </p>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />

              <h2 id="accordion-open-heading-5">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right shadow-md bg-white hover:bg-accent hover:text-white gap-3"
                  data-accordion-target="#accordion-open-body-5"
                  aria-expanded={isSectionOpen(5)}
                  aria-controls="accordion-open-body-5"
                  onClick={() => toggleSection(5)}
                >
                  <span className="flex items-center text-xl">
                    ¿Cuáles son las opciones de pago disponibles?
                  </span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 ${
                      isSectionOpen(5) ? "" : "rotate-180"
                    } shrink-0`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-open-body-5"
                className={`${isSectionOpen(5) ? "" : "hidden"}`}
                aria-labelledby="accordion-open-heading-5"
              >
                <div className="p-5 bg-white">
                  <p className="mb-2">
                    Aceptamos pagos con tarjeta de crédito, transferencia
                    bancaria y pagos en efectivo al momento de la entrega.
                  </p>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />

              <h2 id="accordion-open-heading-6">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right shadow-md bg-white hover:bg-accent hover:text-white gap-3"
                  data-accordion-target="#accordion-open-body-6"
                  aria-expanded={isSectionOpen(6)}
                  aria-controls="accordion-open-body-6"
                  onClick={() => toggleSection(6)}
                >
                  <span className="flex items-center text-xl">
                    ¿Hacen pasteles para personas con alergias o dietas
                    especiales?
                  </span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 ${
                      isSectionOpen(6) ? "" : "rotate-180"
                    } shrink-0`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-open-body-6"
                className={`${isSectionOpen(6) ? "" : "hidden"}`}
                aria-labelledby="accordion-open-heading-6"
              >
                <div className="p-5 bg-white">
                  <p className="mb-2">
                    Sí, hacemos pasteles especiales para personas con alergias
                    alimentarias o dietas específicas. Coméntenos sus
                    necesidades y haremos un pastel a su medida.
                  </p>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />

              <h2 id="accordion-open-heading-7">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right shadow-md bg-white hover:bg-accent hover:text-white gap-3"
                  data-accordion-target="#accordion-open-body-7"
                  aria-expanded={isSectionOpen(7)}
                  aria-controls="accordion-open-body-7"
                  onClick={() => toggleSection(7)}
                >
                  <span className="flex items-center text-xl">
                    ¿Puedo cancelar mi pedido después de realizar el pago?
                  </span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 ${
                      isSectionOpen(7) ? "" : "rotate-180"
                    } shrink-0`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-open-body-7"
                className={`${isSectionOpen(7) ? "" : "hidden"}`}
                aria-labelledby="accordion-open-heading-7"
              >
                <div className="p-5 bg-white">
                  <p className="mb-2">
                    Sí, puedes cancelar tu pedido hasta 48 horas antes de la
                    fecha de entrega programada y te reembolsaremos el 100% del
                    pago.
                  </p>
                </div>
              </div>
              <hr 
              className="my-2 border-gray-200" />
            </div>
          </div>
          <div className="w-full md:w-1/4 flex flex-col items-center md:ml-6 mt-12">
            <button
              className={`shadow-lg w-full mb-4 p-4 text-sm font-medium rounded-lg ${
                activeButton === 1
                  ? "bg-accent text-white"
                  : "bg-primary text-text"
              }`}
              onClick={() => setActiveButton(1)}
            >
              <Link 
              href="/cotizacion">¡SOLICITA TU COTIZACIÓN AQUÍ!</Link>
            </button>
            <Image
              className="rounded-xl mb-4"
              src="/img/yoda.jpg"
              width={270}
              height={391}
              layout="responsive"
              alt="Imagen 1"
            />
            <button
              className={`shadow-lg w-full mb-4 p-4 text-sm font-medium rounded-lg ${
                activeButton === 2
                  ? "bg-accent text-white"
                  : "bg-primary text-text"
              }`}
              onClick={() => setActiveButton(2)}
            >
              <Link 
              href="/enduser/galeria">VER GALERÍA</Link>
            </button>
            <Image
              className="rounded-xl mb-4"
              src="/img/pastelnegro.jpg"
              width={270}
              height={391}
              layout="responsive"
              alt="Imagen 2"
            />
          </div>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}
