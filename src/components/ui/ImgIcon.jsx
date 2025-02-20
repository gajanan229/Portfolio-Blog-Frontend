import React from 'react';

function ImgIcon({ img, name, delay, visible }) {
    return (
        <div
            className={`
                p-4 
                border 
                border-purple-500 
                rounded-lg 
                text-center 
                mb-8 
                transition-all duration-300 ease-in-out 
                opacity-0
                hover:-translate-y-2 
                hover:shadow-[0_0_80px_rgba(139,92,246,0.75)]
                bg-gray-900
            `}
            style={{ 
                animation: visible ? `fadeIn 1s ease-in-out ${delay} forwards` : 'none'
            }}
        >
            <img src={img} alt={name} className="h-12 w-12 mx-auto" />
            <p className="mt-2 text-purple-900">{name}</p>
        </div>
    );
}

export default ImgIcon;