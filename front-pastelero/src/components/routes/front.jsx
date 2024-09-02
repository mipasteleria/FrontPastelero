import dotenv from 'dotenv';

dotenv.config();

export default {
  env: {
    NEXT_PUBLIC_FRONT_URL: process.env.FRONT_DOMAIN,
  },
};