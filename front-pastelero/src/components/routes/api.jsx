import dotenv from 'dotenv';

dotenv.config();

export default {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};