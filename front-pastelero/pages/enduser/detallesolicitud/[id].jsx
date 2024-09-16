import Link from "next/link";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import VerCotizacion from "@/src/components/cotizacionview";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const Detalle = () => {
  const router = useRouter();
  const { id, source } = router.query;
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const fetchImageUrl = async (filename) => {
    if (!filename) {
      console.error("Filename is required");
      return null;
    }
    console.log(`Fetching image URL for file: ${filename}`);
    try {
      const response = await fetch(
        `${API_BASE}/image-url/${filename}`
      );
      console.log("Response Status:", response.status);

      if (!response.ok) {
        throw new Error("Error fetching image URL");
      }
      const data = await response.json();
      console.log("Fetched Data:", data);
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
            console.log("Image filename:", result.data.image); // Verifica el nombre del archivo
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
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <NavbarAdmin />
      <main
        className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24`}
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
