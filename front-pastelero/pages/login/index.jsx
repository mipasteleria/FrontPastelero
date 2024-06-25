import Link from "next/link";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Image from "next/image";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Login() {
  return (
    <main className="bg-primary min-h-screen flex flex-col justify-center items-center">
      <div className={`flex mt-6 justify-center rounded-xl ${sofia.className}`}>
        <Link href="/">
          <Image
            className="h-32 w-32"
            src="/img/logo.JPG"
            width={400}
            height={400}
            alt="logo de Pastelería El Ruiseñor"
          />
        </Link>
        <div className="px-2">
          <div className="text-white text-3xl">
            Pastelería
          </div>
          <div className="text-white text-4xl">
            El Ruiseñor
          </div>
        </div>
      </div>
      <form className="w-11/12 md:w-10/12 lg:w-6/12 my-10 md:my-10 bg-rose-100 border border-accent p-6 rounded-xl shadow-xl">
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
          <input type="email" id="email" className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 " placeholder="name@pasteleriaruiseñor.com" required />
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
          <input type="password" id="password" className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5" required />
        </div>
        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-secondary rounded bg-gray-50 focus:ring-3 focus:ring-accent" required />
          </div>
          <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900">Remember me</label>
        </div>
        <Link href="/dashboard">
            <button type="submit" className="text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
        </Link>
        
      </form>
    </main>
  );
}
