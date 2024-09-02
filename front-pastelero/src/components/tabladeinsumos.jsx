// components/TablaDeInsumos.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function TablaDeInsumos() {
  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await axios.get(`${API_BASE}/insumos`);
        setInsumos(response.data);
      } catch (error) {
        console.error("Error fetching insumos:", error);
      }
    };

    fetchInsumos();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este insumo?")) {
      try {
        await axios.delete(`${API_BASE}/insumos/${id}`);
        setInsumos(insumos.filter((insumo) => insumo._id !== id));
      } catch (error) {
        console.error("Error deleting insumo:", error);
      }
    }
  };

  return (
    <table 
    className="w-full text-sm text-left rtl:text-right text-text">
      <thead 
      className="text-xs uppercase bg-transparent dark:bg-transparent">
        <tr>
          <th 
          scope="col" 
          className="px-6 py-3 border-b border-secondary">
            ID
          </th>
          <th 
          scope="col" 
          className="px-6 py-3 border-b border-secondary">
            Nombre
          </th>
          <th 
          scope="col" 
          className="px-6 py-3 border-b border-secondary">
            Cantidad
          </th>
          <th 
          scope="col" 
          className="px-6 py-3 border-b border-secondary">
            Costo
          </th>
          <th 
          scope="col" 
          className="px-6 py-3 border-b border-secondary">
            Unidad
          </th>
          <th 
          scope="col" 
          className="px-6 py-3 border-b border-secondary">
            Precio por gr/ml
          </th>
          <th 
          scope="col" 
          className="px-6 py-3 border-b border-secondary">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {insumos.length > 0 ? (
          insumos.map((insumo) => (
            <tr
              key={insumo._id}
              className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700"
            >
              <td 
              className="px-6 py-4 border-b border-secondary">
                <span 
                className="ml-2 whitespace-nowrap font-medium dark:text-white">
                  {insumo._id}
                </span>
              </td>
              <td 
              className="px-6 py-4 border-b border-secondary">
                {insumo.name}
              </td>
              <td 
              className="px-6 py-4 border-b border-secondary">
                {insumo.amount}
              </td>
              <td 
              className="px-6 py-4 border-b border-secondary">
                {insumo.cost}
              </td>
              <td 
              className="px-6 py-4 border-b border-secondary">
                {insumo.unit}
              </td>
              <td 
              className="px-6 py-4 border-b border-secondary">
                {insumo.amount && insumo.cost
                  ? (insumo.cost / insumo.amount).toFixed(2)
                  : "N/A"}
              </td>
              <td 
              className="px-6 py-4 border-b border-secondary grid grid-cols-2 gap-2">
                <Link
                  href={`/dashboard/insumosytrabajomanual/editarinsumosotrabajo/${insumo._id}`}
                >
                  <button 
                  className="text-accent dark:text-white hover:underline">
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(insumo._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    className="w-6 h-6 text-accent dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="7"
              className="px-6 py-4 border-b border-secondary text-center"
            >
              No hay insumos disponibles
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
