import Link from "next/link";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import WebFooter from "@/src/components/WebFooter";
import ImportantInfo from "@/src/components/importantinfo";
const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
import CakeFormDetails from "@/src/components/cakeformdetails";

const cakeforminfo ={
  cakeFlavor: "Vainilla",
  portions: "50",
  levels: "3",
  cakeFilling: "vainilla",
  cober: "buttercream",
  fondant: true,
  decorations: ["flores fondant","Figura fondant","Letrero"],
  others: "aqui va texto extra",
  envio: "si",
  LugEnt: "calle 6",
  budget: "1000",
  images: [],
  userName: "Ana",
  userPhone: "55555555",
  userComments: "no",
  Date:"12 Agosto 2024",
  Hour:"12pm",
}

export default function DetalleCotizacion() {
  return (
    <div>
      <NavbarAdmin />
      <main
        className={`text-text ${poppins.className} max-w-screen-lg mx-auto mt-24`}
      >
       <div>
            <CakeFormDetails cakeforminfo={cakeforminfo} />
           
        </div>

          <ImportantInfo />
      </main>
      <WebFooter />
    </div>
  );
}
