import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Poppins as PoppinsFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const VerCotizacion = ({ onCotizacionLoaded }) => {
  const router = useRouter();
  const { id, source } = router.query;
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const fetchImageUrl = async (filename) => {
    console.log("enta entrando al fetch front");
    try {
      const response = await fetch(
        `${API_BASE}/image-url/${filename}`
      );

      if (!response.ok) {
        throw new Error("Error fetching image URL");
      }
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return null;
    }
  };

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
              status:result.data.status,
              name:result.data.priceType
            });
          }

          if (result.data.image) {
            const imageUrl = await fetchImageUrl(result.data.image);
            setImageUrl(imageUrl);
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
      // Verifica si el valor es nulo, indefinido, falso, una cadena vacía o NaN
      if (
        value === null || 
        value === undefined || 
        value === false || 
        value === "" || 
        value === "false" || // Filtra valores de texto "false"
        value === "null" ||  // Filtra valores de texto "null"
        Number.isNaN(value) || 
        (Array.isArray(value) && value.length === 0)
      ) {
        return null; // No renderiza este campo si cumple alguna de estas condiciones
      }
  
      return (
        <div key={key} className="mb-4">
          {(typeof value === "boolean" && value === true) || value === "true" ? (
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={true} // Marca el checkbox solo si es true o "true"
                readOnly
                className="mr-2 text-rose-300 focus:ring-rose-300" 
              />
              {key.replace(/([A-Z])/g, " $1")}
            </label>
          ) : (
            <div className="flex items-center">
              <label htmlFor={key} className="w-1/2">
                <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>
              </label>
              <input
                id={key}
                type="text"
                value={value || ""} // Previene mostrar `undefined` o `null`
                readOnly
                className="border p-2 rounded w-1/2"
              />
            </div>
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
          Imagen: data.image,
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
            Imagen: data.image,
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
            Imagen: data.image,
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