import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Country } from "@/src/types";

interface CountryCardProps {
  country: Country;
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const getLocalTime = (timezone: string) => {
    try {
      const match = timezone.match(/UTC([+-])(\d{2}):?(\d{2})?/);
      if (!match) return "Unknown time";

      const sign = match[1] === "+" ? 1 : -1;
      const hours = parseInt(match[2]) * sign;
      const minutes = parseInt(match[3] || "0") * sign;

      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const localTime = new Date(utcTime + (hours * 3600000 + minutes * 60000));

      return localTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Time unavailable";
    }
  };

  return (
    <Link href={`/countries/${country.code}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full cursor-pointer">
        <div className="relative h-40 w-full" data-testid="flag-container">
          {country.flag ? (
            <Image
              src={country.flag}
              alt={`Flag of ${country.name}`}
              layout="fill"
              objectFit="cover"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg=="
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Flag unavailable</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="font-bold text-lg mb-2 truncate" title={country.name}>
            {country.name}
          </h2>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Region:</span>{" "}
              {country.region || "Unknown"}
            </p>
            <p>
              <span className="font-medium">Capital:</span>{" "}
              {country.capital || "Unknown"}
            </p>
            {country.timezone && country.timezone.length > 0 && (
              <p>
                <span className="font-medium">Local Time:</span>{" "}
                {getLocalTime(country.timezone[0])}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CountryCard;
