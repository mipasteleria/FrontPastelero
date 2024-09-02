import Link from "next/link";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useState } from "react";
import WebFooter from "@/src/components/WebFooter";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function ConocenuestrosProductos() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const isSectionOpen = (section) => {
    return openSection === section;
  };

  return (
    <div>
      <NavbarAdmin />
      <main
        className={`text-text ${poppins.className} max-w-screen-lg mx-auto mt-16`}
      >
        <h1 
        className={`text-4xl p-4 ${sofia.className}`}>
          Conoce nuestros productos
        </h1>
        <div 
        className="p-4" 
        id="accordion-open" 
        data-accordion="open">
          <h2 id="accordion-open-heading-1">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium rtl:text-right border-b-0 border border-secondary rounded-t-xl focus:ring-4 focus:ring-accent hover:bg-rose-50 gap-3"
              data-accordion-target="#accordion-open-body-1"
              aria-expanded={isSectionOpen(1)}
              aria-controls="accordion-open-body-1"
              onClick={() => toggleSection(1)}
            >
              <span 
              className="flex items-center text-xl">
                <Image
                  width={500}
                  height={500}
                  className="rounded-full w-20 h-20 md:h-32 md:w-32 m-6"
                  src="/img/sabores.jpeg"
                  alt=""
                />
                Nuestros sabores
              </span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 ${
                  isSectionOpen(1) ? "" : "rotate-180"
                } shrink-0`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          <div
            id="accordion-open-body-1"
            className={`${isSectionOpen(1) ? "" : "hidden"}`}
            aria-labelledby="accordion-open-heading-1"
          >
            <div 
            className="p-5 border border-b-0 border-secondary leading-relaxed">
              <p 
              className="mb-2">
                <b>Vainilla</b> - El clásico sabor favorito de las fiestas
                infantiles, con un infalible gusto suave y esponjoso que evoca
                recuerdos de infancia y felicidad en cada bocado. ¡Un deleite
                atemporal!
              </p>
              <p 
              className="mb-2">
                <b>Chocolate</b> - Húmedo y con un rico sabor a chocolate, tan
                delicioso que todos tus invitados querrán una porción extra.
                Cada mordisco es una explosión de puro placer chocolatoso que te
                dejará deseando más.
              </p>
              <p 
              className="mb-2">
                <b>Birthday Cake (con confetti 🎉)</b> - Una opción colorida y
                divertida, especialmente diseñada para los festejos de
                cumpleaños. Este pastel no solo es visualmente alegre, sino que
                cada bocado es simplemente delicioso, con un sabor clásico y una
                textura esponjosa que hará sonreír a todos.
              </p>
              <p 
              className="mb-2">
                <b>Red Velvet</b> - Tan suave y terso como el terciopelo, este
                favorito de muchos encanta con su textura sedosa y su distintivo
                sabor a cacao, con un toque de vainilla y un sutil tono ácido
                que lo hace irresistible.
              </p>
              <p 
              className="mb-2">
                <b>Blueberry con Limón y Semilla de Amapola</b> - El más fresco
                de los sabores, único y especial en todos los sentidos. La
                combinación de arándanos jugosos con el toque cítrico del limón
                y la delicada textura de las semillas de amapola crea una
                experiencia gustativa vibrante y refrescante.
              </p>
              <p 
              className="mb-2">
                <b>Zanahoria</b> - Este pastel es un clásico que combina la
                dulzura natural de la zanahoria con un toque de especias
                cálidas. Especiado, húmedo y con un rico sabor a zanahoria, cada
                mordisco es una mezcla perfecta de sabores y texturas que te
                hará sentir como en casa.
              </p>
              <p 
              className="mb-2">
                <b>Naranja</b> - Un sabor natural e intenso que amarás en cada
                bocado. La frescura cítrica de la naranja brilla en este pastel,
                ofreciendo un sabor vibrante y refrescante que despierta tus
                sentidos y te deja con ganas de más.
              </p>
              <p 
              className="mb-2">
                <b>Manzana Canela</b> - Inspirado en la tarta de manzana, este
                pastel combina la dulzura de las manzanas jugosas con el cálido
                abrazo de la canela. Es un bocado nostálgico que evoca la
                comodidad del hogar y el sabor de los momentos especiales.
              </p>
              <p className="mb-2">
                <b>Dulce de Leche</b> - Uno de los más dulces, pero solicitado
                por los amantes del dulce de leche. Este pastel es una
                indulgencia pura, con un sabor rico y caramelizado que se
                derrite en la boca y deja una sensación de satisfacción
                absoluta. ¡Perfecto para los golosos!
              </p>
            </div>
          </div>

          <h2 id="accordion-open-heading-2">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium rtl:text-right border border-b-0 border-secondary focus:ring-4 focus:ring-accent hover:bg-rose-50 gap-3"
              data-accordion-target="#accordion-open-body-2"
              aria-expanded={isSectionOpen(2)}
              aria-controls="accordion-open-body-2"
              onClick={() => toggleSection(2)}
            >
              <span className="flex items-center text-xl">
                <Image
                  width={500}
                  height={500}
                  className="rounded-full w-20 h-20 md:h-32 md:w-32 m-6"
                  src="/img/pay.jpeg"
                  alt=""
                />
                Postres
              </span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 ${
                  isSectionOpen(2) ? "" : "rotate-180"
                } shrink-0`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          <div
            id="accordion-open-body-2"
            className={`${isSectionOpen(2) ? "" : "hidden"}`}
            aria-labelledby="accordion-open-heading-2"
          >
            <div 
            className="p-5 border border-b-0 border-secondary leading-relaxed">
              <p 
              className="mb-2">
                <b>Pay de Queso</b> - Deléitate con nuestro pay de queso, que
                presenta un relleno suave y cremoso con un toque de vainilla,
                sobre una base de galleta rica y crujiente. ¡Una combinación
                perfecta para cualquier ocasión!
              </p>
              <p 
              className="mb-2">
                <b>Brownie</b> - Disfruta de nuestros brownies, crujientes por
                fuera y húmedos por dentro, con un sabor intenso a chocolate que
                te dejará queriendo más.
              </p>
              <p 
              className="mb-2">
                <b>Galletas Decoradas</b> - Nuestras galletas de mantequilla
                decoradas pueden adaptarse a la temática de tu fiesta, añadiendo
                un toque especial y personalizado a tu evento. ¡Son tan bonitas
                como deliciosas!
              </p>
              <p 
              className="mb-2">
                <b>Alfajores</b> - Sumérgete en la delicia de nuestros
                alfajores, con capas de galleta y un relleno dulce que te
                transportará a un mundo de sabores.
              </p>
              <p 
              className="mb-2">
                <b>Macarons</b> - Experimenta la elegancia de nuestros macarons,
                con su delicada textura y una variedad de sabores exquisitos que
                harán las delicias de tu paladar.
              </p>
              <p 
              className="mb-2">
                <b>Donas</b> - Saborea nuestras donas frescas, esponjosas y
                cubiertas con glaseados irresistibles. ¡Perfectas para cualquier
                momento del día!
              </p>
              <p 
              className="mb-2">
                <b>Paletas Magnum</b> - Date un capricho con nuestras paletas
                Magnum, una combinación de helado cremoso cubierto con una
                gruesa capa de chocolate. ¡Un placer congelado!
              </p>
              <p 
              className="mb-2">
                <b>Cupcakes</b> - Nuestros cupcakes, con su esponjosa masa y
                cobertura de crema, son una explosión de sabor en cada bocado.
                ¡Ideales para cualquier celebración!
              </p>
              <p 
              className="mb-2">
                <b>Pan de Naranja con Mermelada de Maracuyá</b> - Prueba nuestro
                pan de naranja, húmedo y aromático, acompañado de una exquisita
                mermelada de maracuyá que añade un toque tropical.
              </p>
              <p 
              className="mb-2">
                <b>Tarta de Frutas</b> - Nuestra tarta de frutas, con su base
                crujiente y una colorida selección de frutas frescas, es un
                postre tan hermoso como delicioso.
              </p>
              <p 
              className="mb-2">
                <b>Galletas Americanas</b> - Disfruta de las clásicas galletas
                americanas, con chispas de chocolate y una textura perfecta que
                te hará sentir como en casa.
              </p>
              <p 
              className="mb-2">
                <b>Tarta de Manzana</b> - Termina tu comida con nuestra tarta de
                manzana, llena de rodajas de manzana jugosa y una pizca de
                canela, todo en una base dorada y crujiente. ¡El postre perfecto
                para cualquier temporada!
              </p>
            </div>
          </div>

          <h2 id="accordion-open-heading-4">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium rtl:text-right border border-b-0 border-secondary focus:ring-4 focus:ring-accent hover:bg-rose-50 gap-3"
              data-accordion-target="#accordion-open-body-4"
              aria-expanded={isSectionOpen(4)}
              aria-controls="accordion-open-body-4"
              onClick={() => toggleSection(4)}
            >
              <span className="flex items-center">
                <Image
                  width={500}
                  height={500}
                  className="rounded-full w-20 h-20 md:h-32 md:w-32 m-6"
                  src="/img/yoda.jpg"
                  alt=""
                />
                Pasteles
              </span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 ${
                  isSectionOpen(4) ? "" : "rotate-180"
                } shrink-0`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          <div
            id="accordion-open-body-4"
            className={`${isSectionOpen(4) ? "" : "hidden"}`}
            aria-labelledby="accordion-open-heading-4"
          >
            <div 
            className="p-5 border border-t-0 border-secondary leading-relaxed">
              <p 
              className="mb-2">
                Lleva tus eventos al siguiente nivel con nuestros impresionantes
                pasteles 3D. Estos pasteles no solo son una delicia para el
                paladar, sino también un espectáculo visual que dejará a todos
                maravillados. Cada pastel 3D es una obra de arte comestible,
                creada meticulosamente para impresionar desde todos los ángulos.
              </p>
              <p 
              className="mb-2">
                Imagina la emoción de tus invitados al ver un pastel que cobra
                vida con detalles realistas y creativos, adaptado perfectamente
                a la temática de tu evento. La experiencia comienza con la
                admiración de su diseño artístico y culmina con la suculencia de
                cada bocado, que combina sabores exquisitos y texturas
                irresistibles.
              </p>
              <p 
              className="mb-2">
                Ya sea un cumpleaños, una boda, un aniversario o cualquier
                celebración especial, nuestros pasteles 3D se convertirán en el
                centro de atención y en el tema de conversación de la fiesta. No
                solo aportan un toque de elegancia y diversión, sino que también
                ofrecen una experiencia multisensorial que hará de tu evento
                algo verdaderamente memorable.
              </p>
              <p 
              className="mb-2">
                Deja que nuestros talentosos pasteleros transformen tu visión en
                realidad y sorprende a tus seres queridos con un pastel que no
                solo se ve increíble, sino que también sabe delicioso. ¡Haz que
                tu celebración sea inolvidable con estos pasteles únicos y
                sorprendentes!
              </p>
            </div>
          </div>

          <h2 
          id="accordion-open-heading-3">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium rtl:text-right border border-b-0 border-secondary focus:ring-4 focus:ring-accent hover:bg-rose-50 gap-3"
              data-accordion-target="#accordion-open-body-3"
              aria-expanded={isSectionOpen(3)}
              aria-controls="accordion-open-body-3"
              onClick={() => toggleSection(3)}
            >
              <span className="flex items-center">
                <Image
                  width={500}
                  height={500}
                  className="rounded-full w-20 h-20 md:h-32 md:w-32 m-6"
                  src="/img/galletas.jpg"
                  alt=""
                />
                Galletas Americanas
              </span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 ${
                  isSectionOpen(3) ? "" : "rotate-180"
                } shrink-0`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          <div
            id="accordion-open-body-3"
            className={`${isSectionOpen(3) ? "" : "hidden"}`}
            aria-labelledby="accordion-open-heading-3"
          >
            <div 
            className="p-5 border border-secondary leading-relaxed">
              <p 
              className="mb-2">
                <b>Galleta de Chips de Chocolate con Nuez:</b> Sumérgete en el
                placer de un clásico irresistible. Esta galleta combina la
                dulzura de los chips de chocolate con el toque crujiente de las
                nueces, creando una experiencia de sabor que te llevará de
                regreso a tus recuerdos más felices.
              </p>
              <p 
              className="mb-2">
                <b>Galleta Red Velvet con Chocolate Blanco:</b> ¡Prepárate para
                un deleite decadente! Nuestra galleta Red Velvet está rellena
                con queso crema, que se complementa perfectamente con los trozos
                de chocolate blanco, ofreciendo una explosión de sabor en cada
                mordisco. ¡Es una auténtica indulgencia!
              </p>
              <p 
              className="mb-2">
                <b>Galleta Matcha con Macadamias:</b> Para aquellos que buscan
                algo exótico, nuestra galleta de matcha con macadamias es la
                elección ideal. Rellena con queso crema y mermelada de
                frambuesa, esta galleta ofrece una combinación única de sabores
                y texturas que sorprenderán y encantarán tu paladar.
              </p>
              <p 
              className="mb-2">
                <b>
                  Galleta de Limón con Semillas de Amapola y Arándanos Azules:
                </b>{" "}
                ¡Una delicia llena de sorpresas refrescantes! Nuestra galleta de
                limón está rellena de lemon curd y mermelada de frambuesa,
                creando un equilibrio perfecto entre el sabor cítrico y la
                dulzura. Las semillas de amapola y los arándanos azules añaden
                un toque de frescura que hará que cada bocado sea una fiesta de
                sabor.
              </p>
              <p 
              className="mb-2">
                <b>Galleta de Pastel de Cumpleaños:</b> ¡Celebra cualquier
                ocasión con nuestra divertida y colorida galleta de pastel de
                cumpleaños! Con su masa suave y esponjosa, decorada con chispas
                de colores, esta galleta es perfecta para traer alegría y
                diversión a cualquier evento. ¡Cada bocado es una celebración!
              </p>
            </div>
          </div>
        </div>
        <p 
        className="bg-rose-50 m-10 p-10 rounded-lg">
          ¿No suena tentador? Ven y prueba estas delicias que no solo satisfarán
          tus antojos, sino que también añadirán un toque especial y delicioso a
          cualquier ocasión. ¡No podrás resistirte!
        </p>
      </main>
      <WebFooter />
    </div>
  );
}
