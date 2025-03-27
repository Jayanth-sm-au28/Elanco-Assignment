import React, { ReactNode } from "react";
const Button = (props: {
  title: string;
  type?: "submit" | "reset" | "button";
  dataTestId?: string;
  onClick?: () => void;
  icon?: ReactNode; 
}) => {
  const { title, onClick, type, dataTestId, icon } = props;
  return (
    <>
      <button
        onClick={onClick}
        type={type}
        data-testid={dataTestId}
        className="flex items-center mb-8 px-4 py-2 bg-gradient-to-r from-purple-500  to-blue-500 shadow rounded  text-white text-base font-bold"
      >
        {icon && <span className="mr-2">{icon}</span>}

        {title}
      </button>
    </>
  );
};

export default Button;
