import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
import DatePicker from "@/src/components/calendario"; // Asegúrate de que este componente está correctamente importado si lo estás usando

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const cakeforminfo = {
    cakeFlavor: "Vanilla",
    portions: "12",
    levels: "2",
    cakeFilling: "Chocolate",
    cober: "Buttercream",
    fondant: true,
    decorations: ["Flowers", "Sprinkles"],
    others: "None",
    envio: "Delivery",
    LugEnt: "123 Cake Street",
    budget: "$50",
    images: ["image1.jpg", "image2.jpg"],
    userName: "John Doe",
    userPhone: "123-456-7890",
    userComments: "No nuts please",
};

const CakeFormDetails = () => {
    return (
        <main className={`text-text ${poppins.className} max-w-screen-lg mx-auto mt-24`}>
            <h1 className={`text-4xl m-4 ${sofia.className}`}>Detalles de Solicitud de Cotización</h1>
            <div className="bg-rose-50 m-4 p-4 rounded-lg shadow-md">
                {Object.entries(cakeforminfo).map(([key, value]) => (
                    <div key={key} className="mb-4">
                        <h2 className="text-2xl mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</h2>
                        <p className="text-lg">
                            {Array.isArray(value) ? value.join(", ") : value.toString()}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default CakeFormDetails;
