import Cakeprice from "../../src/components/cotizacion/cakeprice";

export default function price() {
  return (
    <main>
      <h1>Solicitar cotización</h1>
      <p>
        Le pedimos que complete cada campo con la mayor cantidad de detalles
        posible para acelerar el proceso de cotización. Recuerda que somos una
        empresa pequeña que realiza pocos pasteles a la semana. Por favor,
        solicita tu cotización con suficiente anticipación. Hacemos todo lo
        posible para responder rápidamente, pero a veces puede haber retrasos.
        Agradecemos tu comprensión.
      </p>
      <Cakeprice />
    </main>
  );
}
