import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'; 
import Pedidos from "@/src/components/enuser/pedidos";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function MisPedidos() {
    return (
        <div className={`text-text ${poppins.className}`}>
          <NavbarAdmin />
          <main 
            className={`text-text ${poppins.className} flex-grow w-full md:w-3/4 mx-auto`}>
            <h1>Esto no puede estar vacío o no se despliega</h1>
          <FooterDashboard />
        </main>
        </div>
    )

}