import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const fieldNames = {
    numberOfPeople: "Número de Personas",
    dessertsPerPerson: "Número de Postres por Persona",
    dessertOptions: "Opciones de Postres",
    others: "Otros",
    envio: "Envío",
    LugEnt: "Lugar de Entrega",
    budget: "Presupuesto deseado",
    images: "Imágenes",
    userName: "En Atención a",
    userPhone: "Celular",
    userComments: "Comentarios",
    Date: "Fecha",
    Hour: "Hora",
};

const DessertsFormDetails = ({ dessertforminfo = {} }) => {
    // Use a default value for dessertforminfo to avoid null or undefined issues
    return (
        <main className={`text-text ${poppins.className} max-w-screen-lg mx-auto mt-24`}>
            <h1 className={`text-4xl m-4 ${sofia.className}`}>Detalles de Solicitud de Cotización</h1>
            <p>¡Muchas gracias por considerar nuestra pastelería para tu evento! A continuación, encontrarás la información que hemos recibido en tu solicitud de cotización. Recibirás una notificación tan pronto como tu cotización esté lista. Ten en cuenta que somos una pastelería pequeña, por lo que te agradecemos tu comprensión y paciencia.</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium dark:text-white">
                <div className="md:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(dessertforminfo).map(([key, value]) => (
                            <div key={key}>
                                <label className="capitalize">{fieldNames[key]}</label>
                                <p className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5">
                                    {Array.isArray(value) ? value.join(", ") : value.toString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-1 flex items-start">
                    {/* Puedes agregar cualquier contenido adicional aquí */}
                </div>
            </div>
            <div className="flex flex-col bg-rose-50 p-6 mb-6 rounded-lg">
                <h2 className={`text-xl m-4 ${sofia.className}`}>
                    Postres elegidos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(dessertforminfo.dessertOptions) ? (
                        dessertforminfo.dessertOptions.map((option) => (
                            <label key={option} className="ms-2 text-sm font-medium text-text flex items-center">
                                <input
                                    type="checkbox"
                                    name="dessertOptions"
                                    className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                                    checked={true}
                                    readOnly
                                />
                                <span className="ml-2">{option}</span>
                            </label>
                        ))
                    ) : (
                        <p>No hay opciones de postres seleccionadas</p>
                    )}
                </div>
                <div>
                    <label>Otros</label>
                    <p className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 mt-2">
                        {dessertforminfo.others}
                    </p>
                </div>
            </div>
        </main>
    );
};

export default DessertsFormDetails;
