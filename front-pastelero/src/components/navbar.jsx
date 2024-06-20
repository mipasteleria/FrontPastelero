import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const NavbarAdmin = () => {
  return (
    <nav className={`bg-primary h-16 ${sofia.className}`}>
      <div className="flex">
        <div>
          <div className="text-white px-1 py-0">Pastelería</div>
          <div className="text-white px-1 py-0 text-4xl">El Ruiseñor</div>
        </div>
      </div>
    </nav>
  );
};
export default NavbarAdmin;
