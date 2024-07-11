import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";

export default function Conocenos() {
  return (
    <div>
      <NavbarAdmin />
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-30 pt-8 md:pt-30 max-w-screen-lg mx-auto">
        <div className="photoContainer w-full md:w-1/4 flex justify-center">
          <Image
            className="rounded-xl"
            src="/img/conocenosPastelera.png"
            width={270}
            height={391}
            layout="responsive"
            alt="pastelera posando con un pastel"
          />
        </div>
        <div className="textoConocenosContainer p-8 md:p-30 w-full md:w-3/4 bg-rose-50 rounded-lg text-text">
          <div className="titleConocenos text-4xl">
            <h1>¿Quiénes somos?</h1>
          </div>
          <div className="descripcionTextoConocenos text-lg mt-6">
            <p>
              Pastelería El Ruiseñor nació en 2015, cuando nuestra fundadora,
              Ana González, estaba cursando la carrera de Ingeniería
              Mecatrónica. Su pasión por los pasteles y la necesidad de
              encontrar un apoyo económico extra hicieron que un sueño se
              convirtiera en realidad.
            </p>
            <p className="mt-6">
              Nos sentimos afortunados de estar en constante capacitación,
              siempre aprendiendo y aplicando las técnicas más actuales y de
              tendencia en el mundo pastelero.
            </p>
            <p className="mt-6">
              En lugar de copiar pasteles de una imagen, preferimos
              personalizarlos especialmente para ti. Permítenos la oportunidad
              de maravillar tu fiesta y a tus invitados con un diseño único y
              hecho a tu medida.
            </p>
            <p className="mt-6">
              ¡Será un placer ser parte de tus momentos más dulces!
            </p>
          </div>
        </div>
      </div>
      <WebFooter />
    </div>
  );
}
