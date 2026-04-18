import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import Cakeprice from "@/src/components/cotizacion/cakeprice"
import Snackprice from "@/src/components/cotizacion/snackprice";
import Cupcakeprice from "@/src/components/cotizacion/cupcakeprice";
import { useEffect, useState } from "react";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Cotizacionmanual() {
  const [selectedProduct, setSelectedProduct] = useState("cake");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchData = async () => {
        try {
          const [cakeRes, cupcakeRes, snackRes] = await Promise.all([
            fetch( `${API_BASE}/pricecake/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch("https://pasteleros-back.vercel.app/pricecupcake", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`${API_BASE}/pricesnack/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

          if (cakeRes.ok && cupcakeRes.ok && snackRes.ok) {
            const [cakeData, cupcakeData, snackData] = await Promise.all([
              cakeRes.json(),
              cupcakeRes.json(),
              snackRes.json(),
            ]);

            setUserCotizacion([
              ...cakeData.data.map(item => ({ ...item, type: 'Pastel' })),
              ...cupcakeData.data.map(item => ({ ...item, type: 'Cupcake' })),
              ...snackData.data.map(item => ({ ...item, type: 'Snack' })),
            ]);
          } else {
            throw new Error("Failed to fetch data");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    } else {
    }
  }, []);

  return (
    <div className={`text-text ${poppins.className} mb-20`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4`}>
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Mis cotizaciones</h1>
          <p className={`text-2xl m-4 ${sofia.className}`}>
          Selecciona el producto que deseas cotizar:
        </p>

        <div className="flex justify-between items-center m-4 w-full rounded focus:ring-accent focus:ring-2 focus:border-accent">
          <label className="flex items-center justify-center w-full text-center">
            <input
              type="radio"
              name="product"
              value="cake"
              onChange={() => setSelectedProduct("cake")}
              defaultChecked
              className="mr-2 bg-gray-100 text-accent border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
            />
            Pastel
          </label>
          <label className="flex items-center justify-center w-full text-center">
            <input
              type="radio"
              name="product"
              value="snack"
              onChange={() => setSelectedProduct("snack")}
              className="mr-2 bg-gray-100 text-accent border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
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
      </div>
      <FooterDashboard />
    </div>
  );
}
