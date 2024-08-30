import Link from "next/link";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

// Asegúrate de llamar a `loadStripe` fuera del componente para evitar recrear la instancia en cada renderizado.
const stripePromise = loadStripe("pk_test_51PpLMA05NkS1u2DA81LiZRgfXzRPrk8hkDrlf3JnlqcxkGlOrbo9DXBPf78uimP3IC6xX3DJHVxp6DAOPqeNzSEz00P2FAWsMZ");

export default function Payment() {
  const fetchClientSecret = useCallback(() => {
    // Crear una sesión de Checkout
    return fetch("http://localhost:3001/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <NavbarAdmin />
      <main className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24`}>
        <h1 className={`text-4xl m-4 ${sofia.className}`}>Pagar</h1>
        <div className="flex flex-col md:flex-row gap-8 bg-rose-50 p-6 justify-between w-full">
          <div id="checkout" className="w-full">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}

// Componente para manejar la página de retorno (success o fallo en la compra)
const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  if (status === "complete") {
    return (
      <section id="success">
        <p>
          ¡Agradecemos tu compra! Se enviará un correo de confirmación a {customerEmail}. 
          Si tienes alguna pregunta, por favor envía un correo a <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
};
