import React, { useEffect, useState, useRef } from 'react';
import ImgIcon from './ImgIcon';

function Skills() {
    const [visible, setVisible] = useState(false);
    const skillsRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (skillsRef.current) {
            observer.observe(skillsRef.current);
        }

        return () => {
            if (skillsRef.current) {
                observer.unobserve(skillsRef.current);
            }
        };
    }, []);

    const getRandomDelay = () => `${Math.random() * 1.25}s`;

    return (
        <div ref={skillsRef} className="flex flex-wrap gap-5 justify-center lg:justify-start w-full lg:w-1/2">
            <div className="flex flex-col basis-32 justify-evenly mr-4">
                <ImgIcon img="../../public/logos/python.webp" name="Python" delay={getRandomDelay()} visible={visible} />
                <ImgIcon img="../../public/logos/tensorflow.png" name="TensorFlow" delay={getRandomDelay()} visible={visible} />
                <ImgIcon img="../../public/logos/c.png" name="C" delay={getRandomDelay()} visible={visible} />
            </div>
            <div className="flex flex-col basis-32 justify-evenly ">
                <ImgIcon img="../../public/logos/javascript-logo.png" name="JavaScript" delay={getRandomDelay()} visible={visible} />
                <ImgIcon img="/logos/React.png" name="React" delay={getRandomDelay()} visible={visible} />
                <ImgIcon img="../../public/logos/node.png" name="Node" delay={getRandomDelay()} visible={visible} />
                <ImgIcon img="../../public/logos/html.webp" name="HTML" delay={getRandomDelay()} visible={visible} />
            </div>
            <div className="flex flex-col basis-32 justify-evenly ml-4">
                <ImgIcon img="../../public/logos/java.svg" name="Java" delay={getRandomDelay()} visible={visible} />
                <ImgIcon img="../../public/logos/postgres.png" name="PostgreSQL" delay={getRandomDelay()} visible={visible} />
                <ImgIcon img="../../public/logos/css.webp" name="CSS" delay={getRandomDelay()} visible={visible} />
            </div>
        </div>
    );
};

export default Skills;