import { useState } from "react";
import Cakeprice from "../../src/components/cotizacion/cakeprice";
import Snackprice from "@/src/components/cotizacion/snackprice";
import Cupcakeprice from "@/src/components/cotizacion/cupcakeprice";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";

export default function Price() {
  const [selectedProduct, setSelectedProduct] = useState("");

  return (
    <main>
      <NavbarAdmin />
      <h1>Solicitar cotización</h1>
      <p>
        Le pedimos que complete cada campo con la mayor cantidad de detalles
        posible para acelerar el proceso de cotización. Recuerda que somos una
        empresa pequeña que realiza pocos pasteles a la semana. Por favor,
        solicita tu cotización con suficiente anticipación. Hacemos todo lo
        posible para responder rápidamente, pero a veces puede haber retrasos.
        Agradecemos tu comprensión.
      </p>
      <p>Selecciona el producto que deseas cotizar:</p>

      <div>
        <label>
          <input
            type="radio"
            name="product"
            value="cake"
            onChange={() => setSelectedProduct("cake")}
          />
          Pastel
        </label>
        <label>
          <input
            type="radio"
            name="product"
            value="snack"
            onChange={() => setSelectedProduct("snack")}
          />
          Mesa de postres
        </label>
        <label>
          <input
            type="radio"
            name="product"
            value="cupcake"
            onChange={() => setSelectedProduct("cupcake")}
          />
          Cupcakes
        </label>
      </div>

      {selectedProduct === "cake" && <Cakeprice />}
      {selectedProduct === "snack" && <Snackprice />}
      {selectedProduct === "cupcake" && <Cupcakeprice />}

      <WebFooter />
    </main>
  );
}
