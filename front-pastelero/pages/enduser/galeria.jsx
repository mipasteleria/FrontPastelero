import React, { useState } from "react";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Galeria() {
  const [currentImage, setCurrentImage] = useState("/img/animalcrossing.jpg");

  const handleImageClick = (newImage) => {
    setCurrentImage(newImage);
  };

  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <NavbarAdmin />
      <main
        className={`flex flex-col items-center gap-8 flex-grow max-w-screen-lg mx-auto mt-24 ${poppins.className}`}
      >
        <h1 className={`text-4xl m-4 ${sofia.className}`}>Galería</h1>
        <div className="grid gap-4 mb-10">
          <div className="flex justify-center">
            <Image
              width={500}
              height={500}
              className="h-auto max-w-full rounded-lg object-contain"
              src={currentImage}
              alt="Imagen seleccionada"
              style={{ width: "600px", height: "400px" }}
            />
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div onClick={() => handleImageClick("/img/animalcrossing.jpg")}>
              <Image
                width={500}
                height={500}
                className="h-auto max-w-full rounded-lg cursor-pointer object-cover"
                src="/img/animalcrossing.jpg"
                alt="Animal Crossing"
                style={{ width: "120px", height: "120px" }}
              />
            </div>
            <div onClick={() => handleImageClick("/img/coockies.jpg")}>
              <Image
                width={500}
                height={500}
                className="h-auto max-w-full rounded-lg cursor-pointer object-cover"
                src="/img/coockies.jpg"
                alt="Cookies"
                style={{ width: "120px", height: "120px" }}
              />
            </div>
            <div onClick={() => handleImageClick("/img/yoda.jpg")}>
              <Image
                width={500}
                height={500}
                className="h-auto max-w-full rounded-lg cursor-pointer object-cover"
                src="/img/yoda.jpg"
                alt="Yoda"
                style={{ width: "120px", height: "120px" }}
              />
            </div>
            <div onClick={() => handleImageClick("/img/galletas.jpg")}>
              <Image
                width={500}
                height={500}
                className="h-auto max-w-full rounded-lg cursor-pointer object-cover"
                src="/img/galletas.jpg"
                alt="Galletas"
                style={{ width: "120px", height: "120px" }}
              />
            </div>
            <div onClick={() => handleImageClick("/img/pay.jpeg")}>
              <Image
                width={500}
                height={500}
                className="h-auto max-w-full rounded-lg cursor-pointer object-cover"
                src="/img/pay.jpeg"
                alt="Pay"
                style={{ width: "120px", height: "120px" }}
              />
            </div>
          </div>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}
