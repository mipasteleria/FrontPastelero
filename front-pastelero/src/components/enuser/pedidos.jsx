import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { useAuth } from "@/src/context";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useRouter } from 'next/router'; 
import { FaShoppingCart, FaTimes } from "react-icons/fa"; // Importar iconos
import { CartContext } from "@/src/components/enuser/carritocontext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Pedidos() {
    const [userCotizacion, setUserCotizacion] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Página inicial
    const [limit, setLimit] = useState(10); // Límite de cotizaciones por página
    const [totalPages, setTotalPages] = useState(1); // Total de páginas
    const router = useRouter();
    const { userId } = useAuth() // Usa useContext para obtener el userId
    
    const cart = useContext(CartContext);
    
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const fetchData = async () => {
                try {
                    const [cakeRes, cupcakeRes, snackRes] = await Promise.all([
                        fetch(`${API_BASE}/pricecake?page=${currentPage}&limit=${limit}`, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }),
                        fetch(`${API_BASE}/pricecupcake?page=${currentPage}&limit=${limit}`, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }),
                        fetch(`${API_BASE}/pricesnack?page=${currentPage}&limit=${limit}`, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }),
                    ]);

                    if (cakeRes.ok && cupcakeRes.ok && snackRes.ok) {
                        const [cakeData, cupcakeData, snackData] = await Promise.all([
                            cakeRes.json(),
                            cupcakeRes.json(),
                            snackRes.json(),
                        ]);

                        const totalCotizaciones = Math.max(
                            cakeData.total || 0,
                            cupcakeData.total || 0,
                            snackData.total || 0
                        );
                        setTotalPages(Math.ceil(totalCotizaciones / limit));

                        setUserCotizacion([
                            ...cakeData.data.filter((item) => item.userId === userId).map((item) => ({ ...item, type: "Pastel" })),
                            ...cupcakeData.data.filter((item) => item.userId === userId).map((item) => ({ ...item, type: "Cupcake" })),
                            ...snackData.data.filter((item) => item.userId === userId).map((item) => ({ ...item, type: "Snack" })),
                        ]);
                    } else {
                        throw new Error("Failed to fetch data");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setIsAuthenticated(false);
                }
            };

            fetchData();
        } else {
            setIsAuthenticated(false);
        }
    }, [currentPage, limit, userId]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/'); // Redirigir si no está autenticado
        }
    }, [isAuthenticated, router]);

    // Manejador para cambiar de página
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const CancelCotizacion = async (id, source) => {
        try {
            const token = localStorage.getItem("token");
            let url;

            switch (source) {
                case "Pastel":
                    url = `${API_BASE}/pricecake/${id}`;
                    break;
                case "Cupcake":
                    url = `${API_BASE}/pricecupcake/${id}`;
                    break;
                case "Snack":
                    url = `${API_BASE}/pricesnack/${id}`;
                    break;
                default:
                    console.error("Invalid source: ", source);
                    return;
            }

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: "Cancelado",
                }),
            });

            if (response.ok) {
                setUserCotizacion(
                    userCotizacion.filter((cotizacion) => cotizacion._id !== id)
                );
            } else {
                console.error("Failed to cancel the item. Status:", response.status);
            }
        } catch (error) {
            console.error("An error occurred while canceling the item:", error);
        }
    };

    const handleAddToCart = (id, source) => {
        const amount = 0; // Aquí deberías definir el monto basado en tus datos
        const paymentType = "total"; // Aquí defines el tipo de pago como "total" o "anticipo"
        
        cart.addOneToCart({
            id: id,
            source: source.toLowerCase(),
            paymentType: paymentType,
            amount: amount,
        });
        console.log("Agregado al carrito:", id, source);
    };

    if (!isAuthenticated) {
        return <div>You are not authenticated. Please log in.</div>;
    }

    return (
        <div className={`text-text ${poppins.className}`}>
            <div className="flex flex-row mt-16">
                <main className={`text-text ${poppins.className} flex-grow w-3/4`}>
                    <h1 className={`text-4xl p-4 ${sofia.className}`}>Mis cotizaciones</h1>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between overflow-x-auto shadow-md rounded-lg p-4 m-4">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-sm text-left rtl:text-right text-text">
                                <thead className="text-xs uppercase bg-transparent dark:bg-transparent">
                                    <tr>
                                        {["ID", "Cliente", "Creación", "Solicitud", "Estado", "Acciones"].map((header) => (
                                            <th key={header} className="px-6 py-3 border-b border-secondary">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {userCotizacion.map((cotizacion) => (
                                        <tr key={`cotizacion-${cotizacion._id}`} className="border-b dark:border-gray-700">
                                            {["_id", "contactName", "createdAt", "priceType", "status", "source"].map((field) => (
                                                <td key={field} className="px-6 py-4 border-b border-secondary">
                                                    {cotizacion[field]}
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 border-b border-secondary grid grid-cols-3 gap-6">
                                                <Link href={`/enduser/pedidos/${cotizacion._id}?type=${cotizacion.type}&source=${cotizacion.type.toLowerCase()}`}
                                                    className="bg-rose-300 text-white p-2 rounded-lg flex items-center space-x-2 hover:bg-rose-400">
                                                    <svg className="w-6 h-6 text-accent dark:text-white my-2 mx-.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                                        <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                    </svg>
                                                    <span>Ver detalles</span>
                                                </Link>

                                                <button
                                                    onClick={() => CancelCotizacion(cotizacion._id, cotizacion.type)}
                                                    className="bg-rose-200 text-white p-2 rounded-lg flex items-center space-x-2 hover:bg-red-600"
                                                >
                                                    <FaTimes size={20} /> {/* Icono de cancelar */}
                                                    <span>Cancelar</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
