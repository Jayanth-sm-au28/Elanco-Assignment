import React from "react";
import Head from "next/head";
import CountryDetail from "@/src/components/CountryDetails";

const CountryDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-orange-100 to-red-100">
      <Head>
        <title>Country Details | Country Data Dashboard</title>
        <meta
          name="description"
          content="Detailed information about a country"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <CountryDetail />
      </main>
    </div>
  );
};

export default CountryDetailPage;
