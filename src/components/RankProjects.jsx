import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import SortableItem from "./ui/SortableItem";
import Header from "./Header";
import Footer from "./Footer";

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
    throw new Error("Missing BASE_URL environment variable.");
}

const RankProjects = () => {
    const [projects, setProjects] = useState([]);

    // Fetch projects from the backend on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/projects`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch projects");
                const data = await res.json();
                // Sort projects by complexity (assuming lower complexity means higher rank)
                data.sort((a, b) => a.complexity - b.complexity);
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;
    
        if (active.id !== over.id) {
            const oldIndex = projects.findIndex((p) => p.id === active.id);
            const newIndex = projects.findIndex((p) => p.id === over.id);
            const newProjects = arrayMove(projects, oldIndex, newIndex);
        
            // Update ranks: new rank = index + 1
            const updatedProjects = newProjects.map((project, index) => ({
                ...project,
                complexity: index + 1,
            }));
            setProjects(updatedProjects);
        
            // Update backend for each project with new rank
            try {
                await Promise.all(
                updatedProjects.map(async (project) => {
                    const response = await fetch(`${BASE_URL}/api/projects/${project.id}`, {
                        method: "PATCH",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: project.name,
                            type: project.type,
                            image: project.image,
                            complexity: project.complexity,
                            year: project.year,
                            languages: project.languages,
                            description: project.description,
                            github: project.github,
                        }),
                    });
                    if (!response.ok) {
                        throw new Error("Failed to update project rank");
                    }
                    return response.json();
                })
            );
                alert("Project ranks updated successfully");
            } catch (error) {
                console.error("Error updating ranks:", error);
                alert("Error updating project ranks");
            }
        }
    };

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gray-900 text-white p-8">
                <h1 className="text-3xl font-bold mb-4">Rank Projects</h1>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                    items={projects.map((project) => project.id)}
                    strategy={verticalListSortingStrategy}
                    >
                    <ul className="space-y-4">
                        {projects.map((project, index) => (
                        <SortableItem key={project.id} id={project.id}>
                            <span className="text-lg font-semibold">{project.name}</span>
                            <span className="ml-4 text-sm">Rank: {index + 1}</span>
                        </SortableItem>
                        ))}
                    </ul>
                    </SortableContext>
                </DndContext>
            </div>
            <Footer />
        </div>
    );
}

export default RankProjects;