import React, { useEffect, useState } from "react";
import Typewrite from "./ui/Typewrite";

function Home() {
    const [animate, setAnimate] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
    
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!isMobile) {
            setTimeout(() => setAnimate(true), 500);
        }
    }, [isMobile]);

    const Labels = [
        "Computer Science Student & Lifelong Learner",
        "Software Developer",
        "Frontend Web Developer",
        "Backend Web Developer",
        "Full-Stack Web Developer",
        "Machine Learning Enthusiast",
        "AI Innovator",
        "Technical Problem Solver"
    ];

    if (isMobile) {
        return (
            <main className="flex flex-col justify-center items-center h-screen overflow-hidden relative px-4">
                <div className="mb-6">
                    <img
                        src="../../public/logos/React.png" 
                        alt="Gajanan Vigneswaran"
                        className="w-60 h-60 rounded-full border-4 border-purple-500 shadow-lg"
                    />
                </div>
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4 text-purple-600">
                        Hello, I'm Gajanan Vigneswaran
                    </h1>
                    <Typewrite examples={Labels} />
                </div>
            </main>
        );
    }

    return (
        <main className="flex justify-center items-center h-screen overflow-hidden relative">
            {/* Animated Image */}
            <div
                className="absolute transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(${animate ? '350px' : '0px'})` }}
            >
                <img
                    src="../../public/logos/React.png"
                    alt="Gajanan Vigneswaran"
                    className="w-80 h-80 rounded-full border-4 border-purple-500 shadow-lg"
                />
            </div>
            {/* Animated Text */}
            <div
                className={`transition-opacity duration-2500 ease-in-out ${animate ? "opacity-100" : "opacity-0"}`}
                style={{ marginRight: "350px" }}
            >
                <h1 className="text-5xl font-bold mb-4 text-purple-600">
                    Hello, I'm Gajanan Vigneswaran
                </h1>
                <Typewrite examples={Labels} />
            </div>
        </main>
    );
}

export default Home;