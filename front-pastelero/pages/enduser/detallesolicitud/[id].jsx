import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import VerCotizacion from "@/src/components/cotizacionview";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const Detalle = () => {
  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <NavbarAdmin />
      <main
        className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24 p-4`}
      >
        <h1 className={`text-4xl m-4 ${sofia.className}`}>
          Detalle de Solicitud
        </h1>
        <p>
        ¡Gracias por tu paciencia! Una vez que tu cotización esté lista, podrás consultarla en la sección "Mis pedidos", y su estatus cambiará a "Aceptado".
        </p><p>Somos una pastelería pequeña y valoramos enormemente tu comprensión y apoyo durante este proceso. ¡Te agradecemos mucho!
        </p>

        <Link href="/enduser/mispedidos">
          <div className="my-6 flex items-center gap-4 bg-rose-50 border border-rose-200 rounded-xl p-4 hover:bg-rose-100 transition-colors cursor-pointer">
            <span className="text-3xl animate-bounce">👆</span>
            <div>
              <p className="font-bold text-text">Consulta tus pedidos en <span className="underline text-accent">Mis Pedidos</span></p>
              <p className="text-sm text-gray-500">Ahí podrás ver el estado de esta solicitud y todas tus cotizaciones anteriores.</p>
            </div>
            <svg className="ml-auto w-6 h-6 text-accent flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </Link>

        <VerCotizacion  />
      </main>
      <WebFooter />
    </div>
  );
};

export default Detalle;
