import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Country } from "@/src/types";
import { fetchCountryByCode } from "../services/api";

import Button from "./Button";

const CountryDetail: React.FC = () => {
  const router = useRouter();
  const { code } = router.query;
  const [borderCountryNames, setBorderCountryNames] = useState<{
    [key: string]: string;
  }>({});
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const backIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      ></path>
    </svg>
  );
  useEffect(() => {
    const getCountryDetails = async () => {
      if (!code || typeof code !== "string") return;

      try {
        setLoading(true);
        const data = await fetchCountryByCode(code);
        setCountry(data);

        // If there are border countries, fetch their names
        if (data.borders && data.borders.length > 0) {
          const borderNames: { [key: string]: string } = {};

          // Fetch each border country's details to get its name
          const borderPromises = data.borders.map(async (borderCode) => {
            try {
              const borderCountry = await fetchCountryByCode(borderCode);
              borderNames[borderCode] = borderCountry.name;
            } catch (err) {
              console.error(
                `Error fetching border country ${borderCode}:`,
                err
              );
              borderNames[borderCode] = borderCode; // Fallback to code if fetch fails
            }
          });

          await Promise.all(borderPromises);
          setBorderCountryNames(borderNames);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load country details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getCountryDetails();
  }, [code]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            {error || "Country not found"}
          </h2>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Back to Countries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto h-full px-4 py-8 bg-gradient-to-r from-purple-100 via-orange-100 to-red-100">
      <div className="flex xs:justify-between md:justify-start md:gap-4">
        <Button title="Back" onClick={() => router.back()} icon={backIcon} />
        <Button title="Home" onClick={() => router.push("/")} />
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-full">
              {country.flag ? (
                <Image
                  src={country.flag}
                  alt={`Flag of ${country.name}`}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Flag unavailable</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold mb-6">{country.name}</h1>

            <div className="grid md:grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <p className="text-sm text-gray-600">Capital</p>
                <p className="font-semibold">{country.capital || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Region</p>
                <p className="font-semibold">{country.region || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Population</p>
                <p className="font-semibold">
                  {country.population?.toLocaleString() || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Timezone</p>
                <p className="font-semibold">
                  {country.timezone && country.timezone.length > 0
                    ? country.timezone.join(", ")
                    : "N/A"}
                </p>
              </div>

              {country.currencies && country.currencies.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Currencies</p>
                  <div>
                    {country.currencies.map((currency, index) => (
                      <span key={index} className="font-semibold">
                        {currency.name} ({currency.symbol})
                        {index < country.currencies!.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {country.languages && country.languages.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Languages</p>
                  <div>
                    {country.languages.map((language, index) => (
                      <span key={index} className="font-semibold">
                        {language.name}
                        {index < country.languages!.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {country.borders && country.borders.length > 0 && (
              <div className="mt-8">
                <p className="text-sm text-gray-600 mb-2">Border Countries</p>
                <div className="flex flex-wrap gap-2">
                  {country.borders.map((border) => (
                    <button
                      key={border}
                      onClick={() => router.push(`/countries/${border}`)}
                      className="px-4 py-1 text-sm bg-white shadow rounded hover:bg-gray-50 transition"
                    >
                      {borderCountryNames[border] || border}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
