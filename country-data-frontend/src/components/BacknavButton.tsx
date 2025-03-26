import React from "react";
import { useRouter } from "next/router";

const BacknavButton: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex items-center mb-8 px-4 py-2 bg-gradient-to-r from-purple-500  to-blue-500 shadow rounded  text-white text-base font-bold"
      >
        <svg
          className="w-5 h-5 mr-2"
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
        Back
      </button>
    </>
  );
};

export default BacknavButton;
