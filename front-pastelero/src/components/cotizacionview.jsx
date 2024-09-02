import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Poppins as PoppinsFont } from "next/font/google";
import Image from "next/image";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });

const VerCotizacion = () => {
  const router = useRouter();
  const { id, source } = router.query;
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const fetchImageUrl = async (filename) => {
    console.log("enta entrando al fetch front");
    try {
      const response = await fetch(
        `http://localhost:3001/image-url/${filename}`
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
  }, [id, source]);

  if (!data) return <div>Loading...</div>;

  const renderParagraphs = (items) => {
    return Object.entries(items).map(([key, value]) => {
      if (typeof value === "boolean") {
        value = value ? "Sí" : "No";
      }

      return value ? (
        <p key={key}>
          <strong>{key.replace(/([A-Z])/g, " $1").toUpperCase()}:</strong>{" "}
          {value}
        </p>
      ) : null;
    });
  };

  return (
    <div className={`flex flex-col ${poppins.className}`}>
      {source === "pastel" &&
        renderParagraphs({
          flavor: data.flavor,
          levels: data.levels,
          portions: data.portions,
          delivery: data.delivery,
          stuffedFlavor: data.stuffedFlavor,
          cover: data.cover,
          deliveryAdress: data.deliveryAdress,
          fondantCover: data.fondantCover,
          deliveryDate: data.deliveryDate,
          buttercream: data.buttercream,
          ganache: data.ganache,
          fondant: data.fondant,
          fondantDraw: data.fondantDraw,
          buttercreamDraw: data.buttercreamDraw,
          sugarcharacter3d: data.sugarcharacter3d,
          naturalFlowers: data.naturalFlowers,
          fondantFlowers: data.fondantFlowers,
          sign: data.sign,
          eatablePrint: data.eatablePrint,
          character: data.character,
          other: data.other,
          budget: data.budget,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          questionsOrComments: data.questionsOrComments,
          precio: data.precio,
          anticipo: data.anticipo,
          status: data.status,
        })}

      {source === "snack" &&
        renderParagraphs({
          people: data.people,
          portionsPerPerson: data.portionsPerPerson,
          delivery: data.delivery,
          deliveryAdress: data.deliveryAdress,
          deliveryDate: data.deliveryDate,
          pay: data.pay,
          brownie: data.brownie,
          coockie: data.coockie,
          alfajores: data.alfajores,
          macaroni: data.macaroni,
          donuts: data.donuts,
          lollipops: data.lollipops,
          cupcakes: data.cupcakes,
          bread: data.bread,
          tortaFruts: data.tortaFruts,
          americanCoockies: data.americanCoockies,
          tortaApple: data.tortaApple,
          other: data.other,
          image: data.image,
          budget: data.budget,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          questionsOrComments: data.questionsOrComments,
          precio: data.precio,
          anticipo: data.anticipo,
          status: data.status,
        })}

      {source === "cupcake" &&
        renderParagraphs({
          Sabor: data.flavorBizcocho,
          Relleno: data.stuffedFlavor,
          Cobertura: data.cover,
          porciones: data.portions,
          coberturaFondant: data.fondantCover,
          aDomicilio: data.delivery,
          dirección: data.deliveryAdress,
          fechaEntrega: data.deliveryDate,
          dibujoFondant: data.fondantDraw,
          dibujoCremaDeMani: data.buttercreamDraw,
          floresNaturales: data.naturalFlowers,
          letrero: data.sign,
          impresionComible: data.eatablePrint,
          sprinkles: data.sprinkles,
          otros: data.other,
          presupuesto: data.budget,
          aNombreDe: data.contactName,
          numeroDeContacto: data.contactPhone,
          preguntaOComentarioRealizado: data.questionsOrComments,
          precio: data.precio,
          anticipo: data.anticipo,
          Estado: data.status,
        })}

      {imageUrl && (
        <div className="mt-4">
          <Image
            src={imageUrl}
            width={500}
            height={500}
            alt="Fetched from Cloud Storage"
            className="max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default VerCotizacion;
