import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import WebFooter from "@/src/components/WebFooter";
import ImportantInfo from "@/src/components/importantinfo";
const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
import CupcakeFormDetails from "@/src/components/cupcakeformdetails";

const cupcakeforminfo ={
    cupcakeFlavor: "Vainilla",
    portions: "50",
    cupcakeFilling: "Mermelada de Fresa",
    cober: "Buttercream",
    fondant: false,
    decorations: "Sprinkles",
    others: "no aplica",
    envio: "si",
    LugEnt: "Calle bonita 123",
    budget: "1500",
    images: [],
    userName: "Juan",
    userPhone: "555 555 5555",
    userComments: "no comentarios",
    Date:"12 Agosto 2024",
    Hour:"12pm",
}

export default function DetalleCotizacioncupcake() {
  return (
    <div>
      <NavbarAdmin />
      <main
        className={`text-text ${poppins.className} max-w-screen-lg mx-auto mt-24`}
      >
       <div>
            <CupcakeFormDetails cupcakeforminfo={cupcakeforminfo} />
        </div>

          <ImportantInfo />
      </main>
      <WebFooter />
    </div>
  );
}
