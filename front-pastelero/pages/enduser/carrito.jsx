import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/src/context";
import { useRouter } from 'next/router'; 
import Link from 'next/link';
import NavbarAdmin from '@/src/components/navbar';
import WebFooter from '@/src/components/WebFooter';
import { useAuth } from '@/src/context';
import { Poppins as PoppinsFont, Sofia as SofiaFont } from 'next/font/google';
import Importante from '@/src/components/carritodetails';
import Image from 'next/image';

const poppins = PoppinsFont({ subsets: ['latin'], weight: ['400', '700'] });
const sofia = SofiaFont({ subsets: ['latin'], weight: ['400'] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Carrito() {
  const { userEmail } = useContext(AuthContext);
  const { userId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anticipo, setAnticipo] = useState(0);
  const [amount, setAmount] = useState(0);
  const [Client, setClient] = useState(null)

  const [purchaseData, setPurchaseData] = useState({
    Items: 500,
    amount: 1,
    status: '',
    userId: '',
    quantity: 1,
    email:userEmail,
    
  }); 
  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = [
          'http://localhost:3001/pricecake/',
          'http://localhost:3001/pricecupcake/',
          'http://localhost:3001/pricesnack/',
        ];
        const requests = urls.map(url => fetch(url).then(res => res.json()));
        const responses = await Promise.all(requests);
        let mostRecentData = null;

        responses.forEach(response => {
          const userData = response.data.filter(item => item.userId === userId);
          if (userData.length > 0) {
            const mostRecentItem = userData.reduce((latest, item) => {
              return new Date(item.createdAt) > new Date(latest.createdAt) ? item : latest;
            });
            if (!mostRecentData || new Date(mostRecentItem.createdAt) > new Date(mostRecentData.createdAt)) {
              mostRecentData = mostRecentItem;
            }
          }
        });

        if (mostRecentData) {
          setData(mostRecentData);
          setAnticipo(mostRecentData.anticipo);
          setAmount(mostRecentData.precio);
          console.log(mostRecentData);
          setPurchaseData({
            Items: 1,
            amount: mostRecentData.precio,
            status: mostRecentData.status,
            userId: userId,
            quantity: 1,
            email:userEmail,
            name:mostRecentData.priceType
           
          });
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId, anticipo, data?.precio, userEmail]);
  
  
  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    const newAmount = value === 'anticipo' ? anticipo : data.precio;
    setAmount(newAmount);

    setPurchaseData(prevState => ({
      ...prevState,
      amount: newAmount,
    }));
  };
  
  const handleClick = async () => {
    console.log(purchaseData);
    try {
      const response = await fetch( `${API_BASE}/checkout/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });
  
      if (response.ok) {
        const sessionData = await response.json();
        console.log('Datos enviados con éxito:', sessionData);
        
        // Extrae correctamente el clientSecret de la respuesta del servidor
        const clientSecret = sessionData.clientSecret;
        
        // Guarda el clientSecret en el localStorage
        localStorage.setItem('clientSecret', clientSecret);
        
        // Actualiza el estado con el clientSecret
        setClient(clientSecret);
        
        // Redirige a la página de pago
        router.push('/enduser/pagar');
      } else {
        console.error('Error al enviar los datos al backend:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar los datos al backend:', error);
    }
  };


  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <NavbarAdmin />
      <main className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24`}>
        <h1 className={`text-4xl m-4 ${sofia.className}`}>Su carrito</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 shadow-md">
            <div>
              {data.image && (
                <Image src={data.image} 
                alt="Product"
                width={500} // Valor por defecto o calculado
                height={750} // Valor por defecto o calculado
                layout="responsive" className="w-full h-auto mb-4 rounded-xl" />
              )}
              {data.status && (
                <p className="text-2xl font-bold mb-4"><strong>Status:</strong> {data.status}</p>
              )}
            </div>
            <div>
              {Object.entries(data).filter(([key]) => !['image', 'status', 'anticipo'].includes(key)).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <p><strong>{key}:</strong> {value}</p>
                </div>
              ))}
              {/* Elegir pago */}
              <div className="mb-4">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="anticipo"
                    onChange={handleCheckboxChange}
                  />
                  Pagar Anticipo (${anticipo})
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentOption"
                    value="total"
                    onChange={handleCheckboxChange}
                    defaultChecked // Iniciar con el total seleccionado
                  />
                  Pagar Total (${data.precio})
                </label>
              </div>
            </div>
          </div>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
        <Importante />
        <div className="flex flex-col m-6 md:m-20 md:flex-row justify-center items-center gap-4">
          <button
            className="shadow-lg text-text bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-6 py-4 w-56"
            type="button"
            onClick={handleClick}
          >
            Pagar
          </button>
          <Link href="/">
            <button
              className="shadow-lg text-text bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-6 py-4 w-56">
              Seguir explorando
            </button>
          </Link>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}