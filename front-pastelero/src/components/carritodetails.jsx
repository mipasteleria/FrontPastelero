import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const Importante = () => {
    return (
        <div>
            <div 
            className="mb-10">
                <h2 
                    className={`text-3xl m-4 ${sofia.className}`}>
                    Condiciones e información importante
                </h2>
            <div 
            className="bg-rose-50 m-4 flex flex-col gap-4 p-4">
                <p>
                    Para iniciar su pedido, se solicita un anticipo del 50% del total.
                    Favor de confirmar disponibilidad antes de hacer su pedido.
                </p>
            <p>
                <strong>Vigencia:</strong> El presupuesto es válido por 30 días a partir de la
                fecha estipulada en la orden.
            </p>
            <p>
                <strong>Cancelaciones:</strong> Podrá cancelar su pedido hasta 5 días antes de
                la fecha de entrega, llamando o enviando un mensaje de 9 am a 5 pm
                de lunes a viernes. Se aplicará un cargo del 30% del total del
                pedido; después de este plazo, el cargo será del 50%.
            </p>
            <p>
                <strong>Cambios de diseño:</strong> Puede realizar cambios en el diseño hasta 5
                días antes de la fecha de entrega, lo que podría modificar la
                cotización.
            </p>
            <p>
                <strong>Liquidar y recoger:</strong> Se solicita liquidar su pedido un día
                antes de la entrega. Para recoger su pedido, por favor indique su
                número de orden.
            </p>
            </div>
            </div>
            <p 
            className="text-accent m-6">
            Muchas gracias por tomarte el tiempo para leer toda la información,
            quedamos al pendiente para cualquier duda o aclaración. Te recordamos
            que el horario de atención es de lunes a viernes de 9 am a 6 pm.
            </p>
        </div>
    );
};

export default Importante;