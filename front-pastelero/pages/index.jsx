import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";

export default function Home() {
  return (
    <main>
      <NavbarAdmin />
      <h1 className="text-white">Hola Pasteleros</h1>
      <Link href="/conocenuestrosproductos">
        <button className="btnIntroductionLogIn">Conoce nuestro productos</button>
      </Link>
      <Link href="/dashboard">
        <button className="btnIntroductionLogIn">Dashboard</button>
      </Link>
    </main>
  );
}
