import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import WebFooter from "@/src/components/WebFooter";
import ImportantInfo from "@/src/components/importantinfo";
const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
import DessertFormDetails from "@/src/components/dessertsformdetails";

const dessertforminfo ={
    numberOfPeople: "30",
    dessertsPerPerson: "2",
    dessertOptions: "Opciones de Postres",
    others: "Otros",
    envio: "no",
    LugEnt: "Recogera en sucursal",
    budget: "1500",
    images: "Imágenes",
    userName: "Alexis",
    userPhone: "555 555 5555",
    userComments: "Comentarios",
    Date: "12 Agosto 2024",
    Hour: "12:00 pm",
}

export default function DetalleCotizacion() {
  return (
    <div>
      <NavbarAdmin />
      <main
        className={`text-text ${poppins.className} max-w-screen-lg mx-auto mt-24`}
      >
       <div>
            <DessertFormDetails dessertforminfo={dessertforminfo} />
        </div>

          <ImportantInfo />
      </main>
      <WebFooter />
    </div>
  );
}
