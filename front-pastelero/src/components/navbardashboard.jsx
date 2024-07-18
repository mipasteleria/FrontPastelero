import Image from "next/image";
import Link from "next/link";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useState } from "react";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const NavbarDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav
      className={`bg-primary h-16 ${sofia.className} shadow-md z-50 sticky top-0`}
    >
      <div className="w-full flex flex-wrap items-center justify-between mx-auto">
        <div className="flex">
          <Link href="/">
            <Image
              className="mx-2"
              src="/img/logo.JPG"
              width={64}
              height={64}
              alt=""
            />
          </Link>
          <div>
            <div className="text-white px-2 text-xl">Pastelería</div>
            <div className="text-white text-4xl px-2">El Ruiseñor</div>
          </div>
        </div>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="flex text-sm rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
            onClick={toggleDropdown}
            aria-expanded={dropdownOpen}
          >
            <span className="sr-only">Open user menu</span>
            <Image
              width={500}
              height={500}
              className="w-8 h-8 rounded-full md:mx-6"
              src="/img/userphoto.jpg"
              alt="user photo"
            />
          </button>
          {dropdownOpen && (
            <div className="z-50 fixed top-16 right-2 text-base list-none bg-primary/80 backdrop-blur-sm text-text divide-y divide-gray-100 rounded-lg shadow-xl p-2">
              <ul className="py-2">
                <li>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-lg hover:bg-accent hover:text-white rounded-lg"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-lg hover:bg-accent hover:text-white rounded-lg"
                  >
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
