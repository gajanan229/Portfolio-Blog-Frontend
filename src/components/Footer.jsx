import { useEffect, useState } from "react";
import { FaGithub, FaArrowUp } from "react-icons/fa";

const Footer = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-purple-900 text-white py-6 flex flex-col items-center relative">
        <button 
            className="bg-purple-700 p-3 rounded-full absolute top-[-20px] hover:bg-purple-600 transition" 
            onClick={scrollToTop}
        >
            <FaArrowUp size={20} />
        </button>
        <a 
            href="https://github.com/yourgithub" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-purple-700 p-3 rounded-full mt-12 hover:bg-purple-600 transition"
        >
            <FaGithub size={30} />
        </a>
        <p className="mt-4 text-sm">Gajanan Vigneswaran &copy; {year}</p>
        </footer>
    );
};

export default Footer;