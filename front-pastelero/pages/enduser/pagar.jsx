import React, { useState, useEffect } from "react";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import Pay from '@/src/components/payment/checkoousession'; // Asegúrate de que la ruta sea correcta
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const stripePromise = loadStripe("pk_test_51PpLMA05NkS1u2DA81LiZRgfXzRPrk8hkDrlf3JnlqcxkGlOrbo9DXBPf78uimP3IC6xX3DJHVxp6DAOPqeNzSEz00P2FAWsMZ");

export default function Payment() {
  const fetchClientSecret = useCallback(() => {
    return fetch("http://localhost:3001/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarAdmin />
      <main className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24`}>
        <h1 className={`text-4xl m-4 ${sofia.className}`}>Pago</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 shadow-md">
          <Pay/> 
        </div>
      </main>
      <WebFooter />
    </div>
  );
}

