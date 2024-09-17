import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Poppins as PoppinsFont } from "next/font/google";
import Image from "next/image";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const VerCotizacion = ({ onCotizacionLoaded }) => {
  const router = useRouter();
  const { id, source } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id && source) {
        let url;
        const token = localStorage.getItem("token");

        switch (source) {
          case "pastel":
            url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/pricecake/${id}`;
            break;
          case "cupcake":
            url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/pricecupcake/${id}`;
            break;
          case "snack":
            url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/pricesnack/${id}`;
            break;
          default:
            console.error("Invalid source");
            return;
        }

        try {
          const response = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const result = await response.json();
          setData(result.data);

          if (onCotizacionLoaded) {
            onCotizacionLoaded({
              precio: result.data.precio,
              anticipo: result.data.anticipo,
              status: result.data.status,
              name: result.data.priceType,
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [id, source, onCotizacionLoaded]);

  if (!data) return <div>Loading...</div>;

  const renderFields = (items) => {
    return Object.entries(items).map(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        value === false ||
        value === "" ||
        value === "false" ||
        value === "null" ||
        Number.isNaN(value) ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return null;
      }

      return (
        <div key={key} className="mb-4">
          <label htmlFor={key} className="block text-center mb-2">
            <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>
          </label>
          {typeof value === "string" && value.startsWith("http") ? (
            <div className="text-center">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-2 text-blue-500"
              >
                {value}
              </a>
              <div className="mx-auto mt-2" style={{ maxWidth: "200px" }}>
                <Image
                  src={value}
                  alt={key}
                  width={200}
                  height={200}
                  layout="intrinsic"
                />
              </div>
            </div>
          ) : (
            <input
              id={key}
              type="text"
              value={value || ""}
              readOnly
              className="border p-2 rounded w-1/2 mx-auto block"
            />
          )}
        </div>
      );
    });
  };

  return (
    <div className={`flex flex-col ${poppins.className}`}>
      {source === "pastel" &&
        renderFields({
          Sabor: data.flavor,
          Niveles: data.levels,
          Porciones: data.portions,
          Envio: data.delivery,
          Relleno: data.stuffedFlavor,
          Cobertura: data.cover,
          DireccionDeEntrega: data.deliveryAdress,
          CoberturaConFondant: data.fondantCover,
          FechaDeEntrega: data.deliveryDate,
          CremaMantequilla: data.buttercream,
          Ganache: data.ganache,
          Fondant: data.fondant,
          DibujoEnFondant: data.fondantDraw,
          DibujoEnButtercream: data.buttercreamDraw,
          Figura3D: data.sugarcharacter3d,
          FloresNaturales: data.naturalFlowers,
          FloresDeFondants: data.fondantFlowers,
          Letrero: data.sign,
          ImpresionComestible: data.eatablePrint,
          Personaje: data.character,
          Otro: data.other,
          ImagenUno: data.images[0],
          ImagenDos: data.images[1],
          Presupuesto: data.budget,
          NumeroDeContacto: data.contactName,
          TelefonoDeContacto: data.contactPhone,
          PreguntasOComentarios: data.questionsOrComments,
          Precio: data.precio,
          Anticipo: data.anticipo,
          Estatus: data.status,
        })}

      {source === "snack" &&
        renderFields({
          NumeroDePersonas: data.people,
          PorcionesPorPersona: data.portionsPerPerson,
          Envio: data.delivery,
          DireccionDeEntrega: data.deliveryAdress,
          FechaDeEntrega: data.deliveryDate,
          Pay: data.pay,
          Brownie: data.brownie,
          Galletas: data.coockie,
          Alfajores: data.alfajores,
          Macarrones: data.macaroni,
          Donas: data.donuts,
          Cakepops: data.lollipops,
          cupcakes: data.cupcakes,
          PanDeNaranja: data.bread,
          TartaDeFrutas: data.tortaFruts,
          GalletasAmericanas: data.americanCoockies,
          TartaDeManzana: data.tortaApple,
          Otro: data.other,
          ImagenUno: data.images[0],
          ImagenDos: data.images[1],
          Presupuesto: data.budget,
          NombreDeContacto: data.contactName,
          TelefonoDeContacto: data.contactPhone,
          PreguntasOComentarios: data.questionsOrComments,
          Precio: data.precio,
          Anticipo: data.anticipo,
          Estado: data.status,
        })}

      {source === "cupcake" &&
        renderFields({
          SaborDeBizcocho: data.flavorBizcocho,
          Relleno: data.stuffedFlavor,
          Cobertura: data.cover,
          Porciones: data.portions,
          CoberturaConFondant: data.fondantCover,
          Envio: data.delivery,
          DireccionDeEntrega: data.deliveryAdress,
          FechaDeEntrega: data.deliveryDate,
          DibujoEnFondant: data.fondantDraw,
          DibujoEnButtercream: data.buttercreamDraw,
          FloresNaturales: data.naturalFlowers,
          Letrero: data.sign,
          ImpresionComestible: data.eatablePrint,
          Sprinkles: data.sprinkles,
          Otro: data.other,
          ImagenUno: data.images[0],
          ImagenDos: data.images[1],
          Presupuesto: data.budget,
          NombreDeContacto: data.contactName,
          TelefonoDeContacto: data.contactPhone,
          PreguntasOComentarios: data.questionsOrComments,
          Precio: data.precio,
          Anticipo: data.anticipo,
          Estado: data.status,
        })}
    </div>
  );
};

export default VerCotizacion;
