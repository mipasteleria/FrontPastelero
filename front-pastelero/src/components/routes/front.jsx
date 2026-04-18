import dotenv from 'dotenv';

dotenv.config();

// Asigna el objeto a una variable antes de exportarlo
const frontConfig = {
  env: {
    NEXT_PUBLIC_FRONT_URL: process.env.NEXT_PUBLIC_FRONT_URL, // Usa el prefijo NEXT_PUBLIC_
  },
};

export default frontConfig;
