import React from 'react';
import Link from 'next/link';
import WebFooter from '@/src/components/WebFooter';
import { Poppins as PoppinsFont, Sofia as SofiaFont } from 'next/font/google';
import NavbarAdmin from '@/src/components/navbar';

const poppins = PoppinsFont({ subsets: ['latin'], weight: ['400', '700'] });
const sofia = SofiaFont({ subsets: ['latin'], weight: ['400'] });

const TerminosCondiciones = () => {
  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
        <NavbarAdmin />
        <main className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24`}>
            <h1 className={`text-4xl m-4 ${sofia.className}`}>Términos y Condiciones</h1>
            <p className="mb-4">
                Bienvenido a <strong>pasteleriaelruisenor.com</strong>. Al acceder y utilizar nuestro sitio web, aceptas los siguientes términos y condiciones. Si no estás de acuerdo con ellos, por favor, no utilices nuestro sitio.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. Aceptación de los Términos</h2>
            <p className="mb-4">
                Al acceder y utilizar nuestro sitio web, aceptas cumplir con estos términos y condiciones, así como con todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, no deberías usar nuestro sitio.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Uso del Sitio</h2>
            <p className="mb-4">
                Este sitio está destinado únicamente para uso personal y no comercial. No puedes modificar, reproducir, distribuir, transmitir, exhibir, ejecutar, reproducir, publicar, licenciar, crear trabajos derivados, transferir o vender ningún contenido, información, software, productos o servicios obtenidos de este sitio web.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Propiedad Intelectual</h2>
            <p className="mb-4">
                Todo el contenido incluido en este sitio, como texto, gráficos, logotipos, íconos de botones, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de <strong>Pastelería El Ruiseñor</strong> o de sus proveedores de contenido y está protegido por las leyes de derechos de autor y propiedad intelectual.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Enlaces a Terceros</h2>
            <p className="mb-4">
                Nuestro sitio web puede contener enlaces a otros sitios web que no son operados por nosotros. No tenemos control sobre el contenido y las políticas de esos sitios y no asumimos ninguna responsabilidad por ellos. Te recomendamos leer los términos y condiciones de cualquier sitio de terceros que visites.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">5. Limitación de Responsabilidad</h2>
            <p className="mb-4">
                Pastelería el Ruiseñor no será responsable por ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar este sitio web, incluidos los daños por pérdida de beneficios, interrupción del negocio, pérdida de programas u otra información en tu sistema de manejo de información.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">6. Tus datos y cómo los usamos</h2>
            <p className="mb-4">
              Para atender tus pedidos y cotizaciones necesitamos algunos datos personales
              (nombre, teléfono, correo, dirección de entrega y, cuando aplica, las imágenes
              de referencia que nos compartes). Los usamos únicamente para:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Preparar, cotizar, agendar y entregar tu pedido.</li>
              <li>Enviarte confirmaciones, recordatorios de entrega y comprobantes de pago.</li>
              <li>Responder tus dudas por correo o WhatsApp.</li>
            </ul>
            <p className="mb-4">
              Estos correos son <strong>operativos</strong>: son parte del servicio que
              contrataste y se envían siempre que tengas un pedido activo.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">7. Comunicaciones promocionales (opcionales)</h2>
            <p className="mb-4">
              Al registrarte o solicitar una cotización puedes marcar la casilla para recibir
              novedades, promociones y recordatorios. Es <strong>opcional</strong> y no
              condiciona tu compra ni tu cotización: si no la marcas, igual te atendemos con
              normalidad y solo recibirás los correos operativos del punto anterior.
            </p>
            <p className="mb-4">
              Si diste tu consentimiento, podremos contactarte con novedades. Entre estos
              envíos se incluye un <strong>recordatorio al cumplirse un año</strong> de tu
              solicitud de cotización personalizada, por si tienes una nueva celebración.
              Puedes darte de baja en cualquier momento respondiendo “BAJA” a cualquiera de
              nuestros correos o escribiéndonos por WhatsApp; la baja se aplica sin afectar
              tus pedidos en curso.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">8. Conservación de la información</h2>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>
                <strong>Historial de compras</strong> (galletas, postres, pastel vintage y
                demás productos de precio fijo): lo puedes consultar en tu cuenta durante
                <strong> 18 meses</strong> a partir de la compra, con el detalle de lo que
                pediste y el monto pagado. Después de ese periodo deja de mostrarse en tu
                historial; si necesitas un comprobante anterior, escríbenos y te lo
                compartimos.
              </li>
              <li>
                <strong>Cotizaciones personalizadas</strong>: permanecen disponibles en tu
                cuenta con su detalle y su enlace de consulta. La vigencia del precio
                cotizado es de 30 días, según se indica en cada cotización.
              </li>
              <li>
                <strong>Imágenes de referencia</strong>: se eliminan un mes después de la
                entrega cuando el pedido se concreta, o una semana después de vencida la
                cotización cuando no se concreta.
              </li>
              <li>
                Conservamos los registros fiscales y contables durante los plazos que exige
                la legislación aplicable, aunque ya no se muestren en tu cuenta.
              </li>
            </ul>
            <p className="mb-4">
              Puedes solicitar el acceso, la corrección o la eliminación de tus datos
              escribiéndonos a los contactos del final. Para más detalle consulta nuestro{" "}
              <Link href="/enduser/avisodeprivacidad" className="text-blue-600 hover:underline">aviso de privacidad</Link>.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">9. Modificaciones de los Términos</h2>
            <p className="mb-4">
                Nos reservamos el derecho de hacer cambios en estos términos y condiciones en cualquier momento. Cualquier cambio será publicado en esta página y será efectivo a partir de su publicación. Te recomendamos revisar esta página regularmente para estar al tanto de cualquier cambio.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">10. Ley Aplicable y Jurisdicción</h2>
            <p className="mb-4">
                Estos términos y condiciones se rigen por las leyes de <strong>México</strong>. Cualquier disputa relacionada con el uso de este sitio web se resolverá exclusivamente en los tribunales de <strong>Guadalajara, Jalisco, México</strong>.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">11. Contacto</h2>
            <p className="mb-4">
                Si tienes alguna pregunta o comentario sobre estos términos y condiciones, por favor contáctanos a través de <a href="mailto:correo@ejemplo.com" className="text-blue-600 hover:underline">pasteleria.ruisenor@gmail.com</a> o <a href="tel:+523329295129" className="text-blue-600 hover:underline">3329295129</a>.
            </p>

            <p className="text-sm text-gray-600">Fecha de última actualización: 27 agosto 2024</p>
        </main>
      <WebFooter />
    </div>
  );
};

export default TerminosCondiciones;
