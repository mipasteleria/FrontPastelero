import React, { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51Pu6rHLAsMKHQoNSFIc643grwYeDdIV98CIXoKgmUh5hZ25eTIoleYJOI7PI4zhr3Uj9Zx0p0x5bvzv9ISv1kYRg00sbj1Oc6z");

const CheckoutForm = ({ Items, amount, status, userID, quantity, email}) => {
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
}

export default CheckoutForm;
