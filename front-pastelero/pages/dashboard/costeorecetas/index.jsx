import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Costeorecetas() {
  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4 max-w-screen-lg mx-auto`}>     
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Mis recetas</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between overflow-x-auto shadow-md rounded-lg p-4 m-4">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left rtl:text-right text-text">
                <thead className="text-xs uppercase bg-transparent dark:bg-transparent">
                    <tr>
                        <th scope="col" className="px-6 py-3 border-b border-secondary">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3 border-b border-secondary">
                            Nombre
                        </th>
                        <th scope="col" className="px-6 py-3 border-b border-secondary">
                            Creación
                        </th>
                        <th scope="col" className="px-6 py-3 border-b border-secondary">
                            Modificado
                        </th>
                        <th scope="col" className="px-6 py-3 border-b border-secondary">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700">
                        <td className="px-6 py-4 border-b border-secondary">
                            <span className="ml-2 whitespace-nowrap font-medium dark:text-white">01</span>
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            Pastel de vainilla
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            28/12/2020
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            28/12/2021
                        </td>
                        <td className="px-6 py-4 border-b border-secondary grid grid-cols-3 gap-1">
                        <Link className="" href="/dashboard/costeorecetas/verreceta">
                          <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1" height="1" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                          </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                          <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1" height="1" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd"/>
                          </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                            </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z" clip-rule="evenodd"/>
                            </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                            </svg>
                        </Link>
                        </td>
                    </tr>
                    <tr className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700">
                        <td className="px-6 py-1 border-b border-secondary">
                            <span className="ml-2 whitespace-nowrap font-medium dark:text-white">02</span>
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            Pay de Manzana
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            28/12/2021
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            28/12/2021
                        </td>
                        <td className="px-6 py-4 border-b border-secondary grid grid-cols-3 gap-1">
                        <Link className="" href="/dashboard/costeorecetas/verreceta">
                          <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1" height="1" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                          </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                          <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1" height="1" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd"/>
                          </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                            </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z" clip-rule="evenodd"/>
                            </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                            </svg>
                        </Link>
                        </td>
                    </tr>
                    <tr className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700">
                        <td className="px-6 py-4 border-b border-secondary">
                            <span className="ml-2 whitespace-nowrap font-medium dark:text-white">03</span>
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            Pay de Nuez
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            28/12/2021
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            28/12/2021
                        </td>
                        <td className="px-6 py-4 border-b border-secondary grid grid-cols-3 gap-1">
                        <Link className="" href="/dashboard/costeorecetas/verreceta">
                          <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1" height="1" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                          </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                          <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1" height="1" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd"/>
                          </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                            </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z" clip-rule="evenodd"/>
                            </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                            </svg>
                        </Link>
                        </td>
                    </tr>
                    <tr className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700">
                        <td className="px-6 py-4 border-b border-secondary">
                            <span className="ml-2 whitespace-nowrap font-medium dark:text-white">04</span>
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            Mermelada Blueberri
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            28/12/2021
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            28/12/2021
                        </td>
                        <td className="px-6 py-4 border-b border-secondary grid grid-cols-3 gap-1">
                        <Link className="" href="/dashboard/costeorecetas/verreceta">
                          <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1" height="1" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                          </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                          <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1" height="1" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd"/>
                          </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                            </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z" clip-rule="evenodd"/>
                            </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                            </svg>
                        </Link>
                        </td>
                    </tr>
                    <tr className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700">
                        <td className="px-6 py-4 border-b border-secondary">
                            <span className="ml-2 whitespace-nowrap font-medium dark:text-white">05</span>
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            Buttercream Vainilla
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            28/12/2021
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            28/12/2021
                        </td>
                        <td className="px-6 py-4 border-b border-secondary grid grid-cols-3 gap-1">
                        <Link className="" href="/dashboard/costeorecetas/verreceta">
                          <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1" height="1" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                          </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                          <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1" height="1" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd"/>
                          </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                            </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z" clip-rule="evenodd"/>
                            </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                            <svg class="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                            </svg>
                        </Link>
                        </td>
                    </tr>
                  </tbody>
              </table>
          </div>
          </div>
          <nav aria-label="Page navigation example" class="m-4">
            <ul class="inline-flex -space-x-px text-sm ml-auto">
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-text bg-white border border-e-0 border-secondary rounded-s-lg hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                </li>
                <li>
                <a href="#" aria-current="page" class="flex items-center justify-center px-3 h-8 text-accent border border-secondary bg-blue-50 hover:bg-blue-100 hover:text-accent dark:border-secondary dark:bg-gray-700 dark:text-white">3</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                </li>
                <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary rounded-e-lg hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                </li>
            </ul>
            </nav>

          <Link className="flex justify-end mb-20" href="/dashboard/costeorecetas/nuevareceta">
            <button type="submit" className="text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 m-6">
              Nueva Receta
            </button>
          </Link>
        </main>
        <FooterDashboard/>
      </div>
    </div>
  );
}