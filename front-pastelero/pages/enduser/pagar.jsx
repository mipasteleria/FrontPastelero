import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { useRouter } from "next/router";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const stripePromise = loadStripe("pk_test_51PpLMA05NkS1u2DA81LiZRgfXzRPrk8hkDrlf3JnlqcxkGlOrbo9DXBPf78uimP3IC6xX3DJHVxp6DAOPqeNzSEz00P2FAWsMZ");

export function Payment() {
  const fetchClientSecret = useCallback(() => {
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
      <main 
      className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24`}>
        <h1 
        className={`text-4xl m-4 ${sofia.className}`}>Pagar</h1>
        <div 
        className="flex flex-col md:flex-row gap-8 bg-rose-50 p-6 justify-between w-full">
          <div 
          id="checkout" 
          className="w-full">
            <EmbeddedCheckoutProvider 
            stripe={stripePromise} 
            options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}

export function Return() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const router = useRouter();

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
    router.push("/checkout");
    return null;
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
}
