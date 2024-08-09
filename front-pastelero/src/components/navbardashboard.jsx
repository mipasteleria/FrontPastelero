import Image from "next/image";
import Link from "next/link";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useState } from "react";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const NavbarDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  return (
    <nav
      className={`bg-primary h-16 ${sofia.className} shadow-md z-50 sticky top-0`}
    >
      <div className="w-full flex items-center justify-between mx-auto px-4">
        <div className="flex items-center">
          <Link href="/">
            <Image
              className="mx-2"
              src="/img/logo.JPG"
              width={64}
              height={64}
              alt="Logo"
            />
          </Link>
          <div>
            <div className="text-white px-2 text-xl">Pastelería</div>
            <div className="text-white text-4xl px-2">El Ruiseñor</div>
          </div>
        </div>
        <div className="relative flex items-center space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300"
            onClick={toggleDropdown}
            aria-expanded={dropdownOpen}
            aria-controls="dropdown-menu"
          >
            <span className="sr-only">Open user menu</span>
            <Image
              width={500}
              height={500}
              className="w-8 h-8 rounded-full md:mx-6"
              src="/img/userphoto.jpg"
              alt="User photo"
            />
          </button>
          {dropdownOpen && (
            <div
              id="dropdown-menu"
              className="absolute top-full right-0 mt-2 text-base bg-primary/80 backdrop-blur-sm text-text divide-y divide-gray-100 rounded-lg shadow-xl p-2 z-50"
            >
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
