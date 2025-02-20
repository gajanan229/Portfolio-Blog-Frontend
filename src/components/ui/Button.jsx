import React from 'react';

export const Button = ({ variant, className, children, click }) => {
    const baseClass = "py-2 px-4 rounded-lg font-medium focus:outline-none";
    const variants = {
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
        default: "bg-blue-500 text-white hover:bg-blue-600",
    };


    return (
        <button className={`${baseClass} ${variants[variant]} ${className}`} onClick={click}>
            {children}
        </button>
    );
};

