import dotenv from 'dotenv';

dotenv.config();

const apiConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default apiConfig;
