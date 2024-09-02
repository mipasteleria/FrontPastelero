const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

const testConnection = async () => {
  try {
    const response = await fetch(`${YOUR_DOMAIN}/create-checkout-session`, {
      method: "POST",
    });
    if (response.ok) {
      console.log("Connected to backend successfully");
    } else {
      console.error("Failed to connect to backend:", response.statusText);
    }
  } catch (error) {
    console.error("Error connecting to backend:", error);
  }
};

// Llama a la función para probar la conexión
testConnection();