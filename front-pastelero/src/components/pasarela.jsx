const handleClick = async (event) => {
    try {
      // Realiza una solicitud POST al servidor para crear la sesión de pago
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Añade los encabezados si es necesario
        },
        body: JSON.stringify({ /* datos opcionales */ }),
      });
  
      // Verifica si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error('Error en la solicitud de creación de sesión de pago');
      }
  
      // Convierte la respuesta en JSON
      const session = await response.json();
  
      // Inicializa Stripe con tu clave pública
      const stripe = Stripe('your-publishable-key-here');
  
      // Redirige a la página de pago de Stripe
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
  
      // Manejo de errores en la redirección
      if (error) {
        console.error("Error al redirigir al checkout:", error);
      }
    } catch (error) {
      // Manejo de errores generales
      console.error("Error en el proceso de checkout:", error);
    }
  };
  