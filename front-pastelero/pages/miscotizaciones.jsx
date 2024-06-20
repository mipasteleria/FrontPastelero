import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Miscotizaciones() {
  return (
    <main className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <h1 className={`text-4xl p-4 ${sofia.className}`}>Mis cotizaciones</h1>
    </main>
  );
}