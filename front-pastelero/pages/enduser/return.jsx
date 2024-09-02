import React, { useState } from "react";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import SuccessFail from '@/src/components/payment/successfaild'

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });


export default function returnFinal() {

  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <NavbarAdmin />
      <main
        className={`flex flex-col items-center gap-8 flex-grow max-w-screen-lg mx-auto mt-24 ${poppins.className}`}
      >
        <h1 className={`text-4xl m-4 ${sofia.className}`}>Gracias por tu pago</h1>
        <div className="grid gap-4 mb-10">
            <SuccessFail/>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}

