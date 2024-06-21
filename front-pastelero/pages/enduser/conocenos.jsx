import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";

export default function Conocenos() {
  return (
    <div>
      <NavbarAdmin />
      <div className="conocenosContainer flex gap-[30px] mx-[200px] pt-[30px]">
        <div className=" photoContainer basis-1/4 bg-blue-50 flex justify-center ">
          <Image
            className="rounded-xl w-[270px] h-[391]"
            src="/img/conocenosPastelera.png"
            width={270}
            height={391}
            alt="pastelera posando con un pastel"
          />
        </div>
        <div className=" textoConocenosContainer p-[30px] basis-3/4 bg-red-50 text-text">
          <div className="titleConocenos text-4xl">
            <h1>¿Quienes somos?</h1>
          </div>
          <br />
          <div className="descripcionTextoConocenos text-lg">
            <p>
              Pastelería El Ruiseñor nació en 2015, cuando nuestra fundadora,
              Ana González, estaba cursando la carrera de Ingeniería
              Mecatrónica. Su pasión por los pasteles y la necesidad de
              encontrar un apoyo económico extra hicieron que un sueño se
              convirtiera en realidad.
            </p>
            <br />
            <p>
              Nos sentimos afortunados de estar en constante capacitación,
              siempre aprendiendo y aplicando las técnicas más actuales y de
              tendencia en el mundo pastelero.
            </p>
            <br />
            <p>
              En lugar de copiar pasteles de una imagen, preferimos
              personalizarlos especialmente para ti. Permítenos la oportunidad
              de maravillar tu fiesta y a tus invitados con un diseño único y
              hecho a tu medida.
            </p>
            <br />
            <p>¡Será un placer ser parte de tus momentos más dulces!</p>
          </div>
        </div>
      </div>
      <WebFooter />
    </div>
  );
}
