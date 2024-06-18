import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";

export default function Conocenuestrosproductos() {
  return (
    <main>
      <NavbarAdmin />
      <Link href="/conocenuestrosproductos">
        <button className="btnIntroductionLogIn">productos</button>
      </Link>
    </main>
  );
}
