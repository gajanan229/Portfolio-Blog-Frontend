import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
    throw new Error("Missing BASE_URL environment variable.");
}

const AddProjectPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editProjectId = searchParams.get("edit");

    // Form state
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [imagesInput, setImagesInput] = useState("");
    const [complexity, setComplexity] = useState(0);
    const [year, setYear] = useState("");
    const [languages, setLanguages] = useState("");
    const [description, setDescription] = useState("");
    const [github, setGithub] = useState("");


    // User state (to verify admin access)
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Fetch the current user on mount
    useEffect(() => {
        const fetchCurrentUser = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/current-user`, {
                credentials: "include",
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoadingUser(false);
        }
        };
        fetchCurrentUser();
    }, []);

    // Check if user is admin, otherwise redirect
    useEffect(() => {
        if (!loadingUser && (!user || !user.isadmin)) {
            navigate("/");
        }
    }, [user, loadingUser, navigate]);

    // If editing, fetch project data and prefill the form
    useEffect(() => {
        if (editProjectId) {
            const fetchProject = async () => {
                try {
                    const res = await fetch(`${BASE_URL}/api/projects/${editProjectId}`, {
                        credentials: "include",
                    });
                    if (!res.ok) {
                        throw new Error("Failed to fetch project");
                    }
                    const project = await res.json();
                    setName(project.name || "");
                    setType(project.type || "");
                    // Prefill with multiple image URLs (join array with newlines)
                    setImagesInput(
                        project.images && Array.isArray(project.images) && project.images.length > 0
                            ? project.images.join("\n")
                            : project.image || ""
                    );
                    setComplexity(project.complexity || 0);
                    setYear(project.year || "");
                    setLanguages(project.languages || "");
                    setDescription(project.description || "");
                    setGithub(project.github || "");
                } catch (error) {
                console.error("Error fetching project:", error);
                }
            };
            fetchProject();
        }
    }, [editProjectId]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Split the imagesInput by newline, trim each, and filter out empty lines.
        const images = imagesInput.split("\n").map(url => url.trim()).filter(url => url !== "");
        const payload = { 
            name, 
            type, 
            image: images[0] || "",  // Main image is the first URL
            images, 
            complexity, 
            year, 
            languages, 
            description, 
            github 
        };
    
        try {
            let response;
            if (editProjectId) {
                // Edit mode: send PATCH request
                response = await fetch(`${BASE_URL}/api/projects/${editProjectId}`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
            } else {
                // New project: send POST request
                response = await fetch(`${BASE_URL}/api/projects`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
            }
        
            if (response.ok) {
                alert("Project saved successfully");
                navigate("/");
            } else {
                const errData = await response.json();
                alert(errData.message || "Error saving project");
            }
        } catch (error) {
            console.error("Error saving project:", error);
            alert("An error occurred while saving the project");
        }
    };

    if (loadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Checking admin status...
            </div>
        );
    }

    return (
        <div>
            <Header /> 
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
                <h1 className="text-3xl font-bold mb-8">
                    {editProjectId ? "Edit Project" : "Add Project"}
                </h1>
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                    <div>
                        <label className="block mb-1">Name</label>
                        <input
                            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Type</label>
                        <input
                            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Image URLs (one per line)</label>
                        <textarea
                            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
                            value={imagesInput}
                            onChange={(e) => setImagesInput(e.target.value)}
                            placeholder="Enter each image URL on a new line"
                            rows={4}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Complexity (Rank)</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
                            value={complexity}
                            onChange={(e) => setComplexity(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Year</label>
                        <input
                            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Languages / Tech Stack</label>
                        <input
                            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
                            value={languages}
                            onChange={(e) => setLanguages(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Description</label>
                        <textarea
                            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">GitHub Link</label>
                        <input
                            className="w-full p-2 rounded bg-gray-800 focus:outline-none"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full py-2 bg-purple-500 hover:bg-purple-600 rounded font-semibold">
                        {editProjectId ? "Update Project" : "Submit"}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default AddProjectPage;