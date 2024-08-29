import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Poppins as PoppinsFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });

const VerCotizacion = () => {
  const router = useRouter();
  const { id, source } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id && source) {
        console.log('Source:', source);
        let url;
        const token = localStorage.getItem("token");
        
        switch (source) {
          case 'pastel':
            url = `http://localhost:3001/pricecake/${id}`;
            break;
          case 'cupcake':
            url = `http://localhost:3001/pricecupcake/${id}`;
            break;
          case 'snack':
            url = `http://localhost:3001/pricesnack/${id}`;
            break;
          default:
            console.error("Invalid source");
            return;
        }

        try {
          const response = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const result = await response.json();
          console.log('Fetched data:', result.data); // Verifica los datos obtenidos
          setData(result.data); // Ajusta aquí para acceder a `result.data`
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [id, source]);

  if (!data) return <div>Loading...</div>;

  const renderParagraphs = (items) => {
    return Object.entries(items).map(([key, value]) => {
      if (key === 'status') {
        value = value ? 'Aprobado' : 'Pendiente';
      }
      return value ? <p key={key}><strong>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong> {value}</p> : null;
    });
  };
  

  return (
    <div className={`flex flex-col ${poppins.className}`}>
      {source === 'pastel' && renderParagraphs({
        flavor: data.flavor,
        levels: data.levels,
        portions: data.portions,
        delivery: data.delivery,
        stuffedFlavor: data.stuffedFlavor,
        cover: data.cover,
        deliveryAdress: data.deliveryAdress,
        fondantCover: data.fondantCover,
        deliveryDate: data.deliveryDate,
        buttercream: data.buttercream,
        ganache: data.ganache,
        fondant: data.fondant,
        fondantDraw: data.fondantDraw,
        buttercreamDraw: data.buttercreamDraw,
        sugarcharacter3d: data.sugarcharacter3d,
        naturalFlowers: data.naturalFlowers,
        fondantFlowers: data.fondantFlowers,
        sign: data.sign,
        eatablePrint: data.eatablePrint,
        character: data.character,
        other: data.other,
        image: data.image,
        budget: data.budget,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        questionsOrComments: data.questionsOrComments,
        precio: data.precio,
        anticipo: data.anticipo,
        status: data.status
      })}

      {source === 'snack' && renderParagraphs({
        people: data.people,
        portionsPerPerson: data.portionsPerPerson,
        delivery: data.delivery,
        deliveryAdress: data.deliveryAdress,
        deliveryDate: data.deliveryDate,
        pay: data.pay,
        brownie: data.brownie,
        coockie: data.coockie,
        alfajores: data.alfajores,
        macaroni: data.macaroni,
        donuts: data.donuts,
        lollipops: data.lollipops,
        cupcakes: data.cupcakes,
        bread: data.bread,
        tortaFruts: data.tortaFruts,
        americanCoockies: data.americanCoockies,
        tortaApple: data.tortaApple,
        other: data.other,
        image: data.image,
        budget: data.budget,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        questionsOrComments: data.questionsOrComments,
        precio: data.precio,
        anticipo: data.anticipo,
        status: data.status
      })}

      {source === 'cupcake' && renderParagraphs({
        flavorBizcocho: data.flavorBizcocho,
        stuffedFlavor: data.stuffedFlavor,
        cover: data.cover,
        portions: data.portions,
        fondantCover: data.fondantCover,
        delivery: data.delivery,
        deliveryAdress: data.deliveryAdress,
        deliveryDate: data.deliveryDate,
        fondantDraw: data.fondantDraw,
        buttercreamDraw: data.buttercreamDraw,
        naturalFlowers: data.naturalFlowers,
        sign: data.sign,
        eatablePrint: data.eatablePrint,
        sprinkles: data.sprinkles,
        other: data.other,
        image: data.image,
        budget: data.budget,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        questionsOrComments: data.questionsOrComments,
        precio: data.precio,
        anticipo: data.anticipo,
        status: data.status
      })}
    </div>
  );
};

export default VerCotizacion;
