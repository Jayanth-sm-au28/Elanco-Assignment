import React, { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Country Data Dashboard",
}) => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <header className="bg-gradient-to-r from-purple-100 via-orange-100 to-red-100 text-white shadow-md">
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-center items-center text-center">
            <Link href="/">
              <p className="xs:text-sm lg:text-3xl font-bold text-center text-rose-500">
                Country Data Dashboard
              </p>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow ">{children}</main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <p className="text-center">
            © {new Date().getFullYear()} Country Data Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
