import React, { useState } from "react";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Galeria() {
  const [currentImage, setCurrentImage] = useState(
    "https://flowbite.s3.amazonaws.com/docs/gallery/featured/image.jpg"
  );

  const handleImageClick = (newImage) => {
    setCurrentImage(newImage);
  };

  return (
    <div className={poppins.className}>
      <NavbarAdmin />
      <main className={`flex flex-col items-center gap-8 pt-8 pb-16 max-w-screen-lg mx-auto ${poppins.className}`}>
        <h1 className={`text-4xl m-6 ${sofia.className}`}>Galería</h1>
        <div className="grid gap-4 mb-10">
          <div className="flex justify-center">
            <img
              className="h-auto max-w-full rounded-lg"
              src={currentImage}
              alt=""
            />
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div onClick={() => handleImageClick("https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg")}>
              <img
                className="h-auto max-w-full rounded-lg cursor-pointer"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg"
                alt=""
              />
            </div>
            <div onClick={() => handleImageClick("https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg")}>
              <img
                className="h-auto max-w-full rounded-lg cursor-pointer"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg"
                alt=""
              />
            </div>
            <div onClick={() => handleImageClick("https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg")}>
              <img
                className="h-auto max-w-full rounded-lg cursor-pointer"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg"
                alt=""
              />
            </div>
            <div onClick={() => handleImageClick("https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg")}>
              <img
                className="h-auto max-w-full rounded-lg cursor-pointer"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg"
                alt=""
              />
            </div>
            <div onClick={() => handleImageClick("https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg")}>
              <img
                className="h-auto max-w-full rounded-lg cursor-pointer"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}
