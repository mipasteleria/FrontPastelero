import React, { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
const key=process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
// Mueve stripePromise fuera del componente
const stripePromise = loadStripe(key);

const CheckoutForm = () => {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // Recupera el clientSecret desde el localStorage
    const storedClientSecret = localStorage.getItem('clientSecret');
    setClientSecret(storedClientSecret);
  }, []);

  if (!clientSecret) {
    return <p>Cargando...</p>; // Mostrar un mensaje de carga mientras se obtiene el clientSecret
  }

  const options = { clientSecret }; // Usa el clientSecret directamente

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;
