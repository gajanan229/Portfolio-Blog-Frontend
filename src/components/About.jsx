import React, { useEffect, useState, useRef } from 'react';
import Skills from './ui/Skills';

function About() {
    const [visible, setVisible] = useState(false);
    const aboutRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (aboutRef.current) {
            observer.observe(aboutRef.current);
        }

        return () => {
            if (aboutRef.current) {
                observer.unobserve(aboutRef.current);
            }
        };
    }, []);

    

    return (
        <section id="about" className="min-h-screen text-white flex flex-col items-center justify-center px-8 py-8" ref={aboutRef}>
            <h1 className="text-4xl font-bold mb-12 text-purple-400 border-b-4 border-purple-500">About</h1>
            <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-60">
                <div className="flex flex-col items-center justify-center w-full lg:w-1/2 mt-12 lg:mt-0">
                    <img
                        src="https://picsum.photos/200"
                        alt="Gajanan V"
                        className="h-48 w-48 rounded-full border-4 border-purple-500 mb-8"
                    />
                    <p className={`text-center text-lg  max-w-prose transition-transform duration-1000 ease-in-out ${visible ? 'translate-x-0 opacity-100' : '-translate-x-40 opacity-0'}`}>
                    I’m a computer science student who’s always curious and eager to learn, especially when it comes to software development, AI, and web development. I enjoy solving problems, building things, and figuring out how different technologies work. Outside of tech, I like staying active, going to concerts, and watching movies. I try to keep a good balance between learning, working, and enjoying life.
                    </p>
                </div>
                <Skills />
            </div>
        </section>
    );
};

export default About;