const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE}/create-checkout-session`, {
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