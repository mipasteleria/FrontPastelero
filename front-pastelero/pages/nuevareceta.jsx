import Link from "next/link";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import NavbarDashboard from "@/src/components/navbardashboard";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Nuevareceta() {
  return (
    <main className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <h1 className={`text-4xl p-4 ${sofia.className}`}>Nueva Receta</h1>
    </main>
  );
}