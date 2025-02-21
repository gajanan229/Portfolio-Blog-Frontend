import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BASE_URL = process.env.VITE_BASE_URL;
if (!BASE_URL) {
    throw new Error("Missing BASE_URL environment variable.");
}

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [hoveredProject, setHoveredProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/projects`);
                if (!response.ok) {
                throw new Error("Failed to fetch projects");
                }
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
    
        fetchProjects();
    }, []);

    return (
        <div
            id="projects"
            className="flex flex-col md:flex-row pt-20 pb-10 px-4 md:px-30"
        >
            {/* Image Section - Only visible on desktop */}
            <div className="hidden md:flex flex-1 justify-center items-center mr-8">
                <div
                    className="w-full max-h-[500px] flex justify-center items-center"
                    style={{ height: "500px" }}
                >
                    {hoveredProject && (
                        <motion.img
                        src={hoveredProject.images[0]}
                        alt={hoveredProject.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-[800px] h-[500px] object-cover rounded-4xl"
                        />
                    )}
                </div>
            </div>

            {/* Project List Section */}
            <div className="flex-1 max-w-md mx-auto">
                <div className="pr-8 py-8 relative">
                    <h1 className="text-4xl font-bold mb-4 border-b border-gray-700 pb-2 text-center md:text-left">
                        PROJECTS
                    </h1>
                    <span className="absolute top-8 right-8 text-2xl font-bold text-gray-500">
                        {projects.length}
                    </span>
                    <div className="overflow-y-scroll h-[400px] space-y-4 no-scrollbar container">
                        {projects.map((project, index) => (
                        <div key={index} className="border-t pt-2">
                            <motion.div
                                className="flex items-center justify-between"
                                onHoverStart={() => setHoveredProject(project)}
                                onHoverEnd={() => setHoveredProject(null)}
                            >
                                <div className="relative text-xl">
                                    <Link to={`/project/${project.id}`}>
                                        <motion.span
                                            className="inline-block"
                                            whileHover={{ x: 15 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {project.name}
                                        </motion.span>
                                    </Link>
                                </div>
                                <span className="text-gray-500">{project.type}</span>
                            </motion.div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectList;