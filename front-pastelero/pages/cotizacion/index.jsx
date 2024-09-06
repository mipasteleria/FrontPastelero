import { useState } from "react";
import Cakeprice from "../../src/components/cotizacion/cakeprice";
import Snackprice from "@/src/components/cotizacion/snackprice";
import Cupcakeprice from "@/src/components/cotizacion/cupcakeprice";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Price() {
  const [selectedProduct, setSelectedProduct] = useState("cake");

  return (
    <>
      <NavbarAdmin />
      <main
        className={`text-text ${poppins.className} mt-24 max-w-screen-lg mx-auto`}
      >
        <h1 className={`text-4xl m-6 ${sofia.className}`}>
          Solicitar cotización
        </h1>
        <p>
          Le pedimos que complete cada campo con la mayor cantidad de detalles
          posible para acelerar el proceso de cotización. Recuerda que somos una
          empresa pequeña que realiza pocos pasteles a la semana. Por favor,
          solicita tu cotización con suficiente anticipación. Hacemos todo lo
          posible para responder rápidamente, pero a veces puede haber retrasos.
          Agradecemos tu comprensión.
        </p>
        <p className={`text-2xl m-4 ${sofia.className}`}>
          Selecciona el producto que deseas cotizar:
        </p>

        <div className="flex justify-between items-center m-4 w-full text-rose-300 rounded focus:ring-accent focus:ring-2 focus:border-accent">
          <label className="flex items-center justify-center w-full text-center">
            <input
              type="radio"
              name="product"
              value="cake"
              onChange={() => setSelectedProduct("cake")}
              defaultChecked
              className="mr-2 bg-gray-100 text-secondary border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
            />
            Pastel
          </label>
          <label className="flex items-center justify-center w-full text-center">
            <input
              type="radio"
              name="product"
              value="snack"
              onChange={() => setSelectedProduct("snack")}
              className="mr-2 bg-gray-100 text-secondary border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
            />
            Mesa de postres
          </label>
          <label className="flex items-center justify-center w-full text-center">
            <input
              type="radio"
              name="product"
              value="cupcake"
              onChange={() => setSelectedProduct("cupcake")}
              className="mr-2 bg-gray-100 text-secondary border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
            />
            Cupcakes
          </label>
        </div>

        {selectedProduct === "cake" && <Cakeprice />}
        {selectedProduct === "snack" && <Snackprice />}
        {selectedProduct === "cupcake" && <Cupcakeprice />}
      </main>
      <WebFooter />
    </>
  );
}
