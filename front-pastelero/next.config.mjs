/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Antes esto era `hostname: '**'`, es decir: cualquier dominio de
    // internet. Eso convertía /_next/image en un proxy abierto — cualquiera
    // podía pedirle a tu sitio que descargara y procesara una imagen
    // arbitraria (gasto de ancho de banda a tu costa), y además dejaba
    // alcanzables desde fuera las vulnerabilidades del optimizador de
    // imágenes de Next, que es donde han salido los fallos más graves.
    //
    // Ahora solo se permiten los hosts desde los que realmente sirves
    // imágenes: tu backend, que hace de proxy de Google Cloud Storage.
    // Si algún día sirves imágenes desde otro dominio, agrégalo aquí.
    remotePatterns: [
      { protocol: 'https', hostname: 'api.pasteleriaelruisenor.com', pathname: '/file/**' },
      { protocol: 'https', hostname: 'back-pastelero.vercel.app', pathname: '/file/**' },
      { protocol: 'https', hostname: 'back-pastelero-animelendrezs-projects.vercel.app', pathname: '/file/**' },
    ],
    // El optimizador no debe intentar procesar SVG: es el formato con el
    // que se han explotado varios fallos de esta API. Está en false por
    // defecto, pero se deja explícito para que nadie lo active sin pensarlo.
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;
