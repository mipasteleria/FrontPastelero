import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
        <VerCotizacion  />
      </main>
      <WebFooter />
    </div>
  );
};

export default Detalle;
