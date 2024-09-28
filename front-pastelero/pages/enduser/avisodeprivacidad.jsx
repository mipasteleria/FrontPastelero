import React from 'react';
import WebFooter from '@/src/components/WebFooter';
import { Poppins as PoppinsFont, Sofia as SofiaFont } from 'next/font/google';
import NavbarAdmin from '@/src/components/navbar';

const poppins = PoppinsFont({ subsets: ['latin'], weight: ['400', '700'] });
const sofia = SofiaFont({ subsets: ['latin'], weight: ['400'] });

const AvisoPrivacidad = () => {
  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
        <NavbarAdmin />
        <main className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24`}>
            <h1 className={`text-4xl m-4 ${sofia.className}`}>Aviso de Privacidad</h1>
            <p className="mb-4">
                <strong>pasteleriaelruisenor.com</strong>, en cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y su Reglamento, informa lo siguiente:
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. Responsable del Tratamiento de sus Datos Personales</h2>
            <p className="mb-4">
                <strong>pasteleriaelruisenor.com</strong> es responsable del tratamiento de sus datos personales, los cuales serán utilizados para [finalidades específicas como la prestación de servicios, facturación, creación de perfiles de usuario, etc.].
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Datos Personales que Recabamos</h2>
            <ul className="list-disc list-inside mb-4">
                <li>Nombre completo</li>
                <li>Dirección</li>
                <li>Teléfono</li>
                <li>Correo electrónico</li>
                <li>Datos de pago</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Finalidades del Tratamiento de Datos Personales</h2>
            <p className="mb-4">
                Sus datos personales se utilizarán para los siguientes fines:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Proveer los productos y servicios solicitados.</li>
                <li>Notificar sobre nuevos productos o servicios relacionados con los contratados.</li>
                <li>Informarle sobre cambios en nuestros productos o servicios.</li>
                <li>Evaluar la calidad del servicio que le brindamos.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Transferencia de Datos Personales</h2>
            <p className="mb-4">
                No transferimos sus datos personales a terceros, salvo en casos exigidos por la ley o cuando sea necesario para la prestación de nuestros servicios.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">5. Medios para Ejercer los Derechos ARCO</h2>
            <p className="mb-4">
                Usted tiene derecho a <strong>Acceder, Rectificar, Cancelar u Oponerse (ARCO)</strong> al tratamiento de sus datos personales. Para ejercer estos derechos, puede contactar a nuestro departamento de protección de datos personales en:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Correo electrónico: <a href="mailto:correo@ejemplo.com" className="text-blue-600 hover:underline">pasteleria.ruisenor@gmail.com</a></li>
                <li>Teléfono: <a href="tel:+52XXXXXXXXXX" className="text-blue-600 hover:underline">3741025036</a></li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">6. Cambios al Aviso de Privacidad</h2>
            <p className="mb-4">
                Nos reservamos el derecho de realizar modificaciones o actualizaciones a este Aviso de Privacidad en cualquier momento, para atender novedades legislativas o políticas internas. Las modificaciones estarán disponibles en nuestro sitio web: <a href="pasteleriaelruisenor.com" className="text-blue-600 hover:underline">pasteleriaelruisenor.com</a>.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">7. Consentimiento</h2>
            <p className="mb-4">
                Al proporcionar sus datos personales, usted acepta el tratamiento conforme a los términos de este Aviso de Privacidad.
            </p>

            <p className="text-sm text-gray-600">Fecha de última actualización: 26 septiembre 2024</p>
        </main>
      <WebFooter/>
    </div>
  );
};

export default AvisoPrivacidad;
