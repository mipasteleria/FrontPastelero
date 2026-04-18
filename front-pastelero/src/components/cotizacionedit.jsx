import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Poppins as PoppinsFont } from "next/font/google";
import Swal from 'sweetalert2';

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const DetalleCotizacion = () => {
  const router = useRouter();
  const { id, source } = router.query;
  const [data, setData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id && source) {
        let url;
        const token = localStorage.getItem("token");
        
        switch (source) {
          case 'pastel':
            url =  `${API_BASE}/pricecake/${id}`;
            break;
          case 'cupcake':
            url =  `${API_BASE}/pricecupcake/${id}`;
            break;
          case 'snack':
            url =  `${API_BASE}/pricesnack/${id}`;
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
          setData(result.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [id, source]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
  
    if (id && source) {
      let url;
      const token = localStorage.getItem("token");
      const updatedData = { ...data };
  
      switch (source) {
        case 'pastel':
          url = `${API_BASE}/pricecake/${id}`;
          break;
        case 'cupcake':
          url = `${API_BASE}/pricecupcake/${id}`;
          break;
        case 'snack':
          url = `${API_BASE}/pricesnack/${id}`;
          break;
        default:
          console.error("Invalid source");
          setIsSaving(false);
          return;
      }
  
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const result = await response.json();
        console.log('Update successful:', result);
  
        // Mostrar alerta de éxito con SweetAlert2
        Swal.fire({
          title: "¡Cotización Actualizada!",
          text: "Esta cotización ha sido editada correctamente.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff1f2",
          color: "#540027",
        }).then(() => {
          // Redirigir después de mostrar la alerta
          router.push('/dashboard/cotizaciones');
        });
  
      } catch (error) {
        console.error("Error updating data:", error);
        setError("Error updating data. Please try again.");
        Swal.fire({
          title: "Error",
          text: "Error al actualizar la cotización. Por favor, inténtelo de nuevo.",
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff1f2",
          color: "#540027",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  if (!data) return <div>Loading...</div>;

  const renderInputs = (items) => {
    return Object.entries(items).map(([key, value]) =>
      <div key={key} className="mb-4 text-text">
        <label htmlFor={key} className="block text-sm font-medium">
          {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
        </label>
        <input
          id={key}
          name={key}
          type="text"
          value={value || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-secondary rounded-md shadow-sm"
        />
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${poppins.className}`}>
      {source === 'pastel' && renderInputs({
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
      })}

      {source === 'snack' && renderInputs({
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
      })}

      {source === 'cupcake' && renderInputs({
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
      })}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="shadow-md text-white bg-accent hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center"
      >
        {isSaving ? 'Actualizando...' : 'Actualizar'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default DetalleCotizacion;
