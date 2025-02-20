import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Button } from "./ui/Button";


const Project = () => {
    const { id } = useParams();
    const navigate = useNavigate();   
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // User state (to verify admin access)
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
            const fetchCurrentUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/current-user", {
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

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
                    credentials: "include",
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch project");
                }
                const data = await res.json();
                setProject(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (response.ok) {
                    alert("Project deleted successfully");
                    navigate("/");
                } else {
                    const errData = await response.json();
                    alert(errData.message || "Failed to delete project");
                }
            } catch (error) {
                console.error("Error deleting project:", error);
                alert("Error deleting project");
            }
        }
    };

    const handleEdit = async () => {
        if (window.confirm("Are you sure you want to Edit this project?")) {
            navigate(`/add-project?edit=${id}`);
        }
    };

    const NewTab = (link) => {
        if(link){
            window.open(
                link, "_blank"
            );
        }
        
    }

    if (loading || loadingUser) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-900 text-red-500">
                Error: {error}
            </div>
        );
    }

    const {
        name,
        type,
        image,
        year,
        languages,
        description,
        github
    } = project;

    // Determine images: Use the 'images' array if available and non-empty; fallback to 'image'
    const images = project.images && Array.isArray(project.images) && project.images.length > 0
        ? project.images
        : [project.image];

    // The main image is the first image; extra images are the rest.
    const mainImage = images[0];
    const extraImages = images.slice(1);

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pb-8 px-4 md:px-60">
                {/* Top: Main Project Image */}
                {mainImage && (
                <img
                    src={mainImage}
                    alt={name}
                    className="mb-8 w-full object-contain rounded-b-4xl shadow-lg"
                />
                )}
                
                {/* Project Details Container */}
                <div className="w-full bg-gray-800 p-6 rounded-4xl shadow-xl relative">
                {/* Project Title */}
                <h1 className="text-4xl font-bold mb-4 text-purple-400 uppercase tracking-widest">
                    {name}
                </h1>
                <hr className="pb-2" width="100%" size="2" />
                {/* Metadata Row: Stack vertically on mobile, horizontal on md+ */}
                <div className="flex flex-col md:flex-row gap-8 mb-6">
                    <div className="w-full md:w-1/2">
                    <div className="pt-5">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-1">
                        Category
                        </h2>
                        <p className="text-lg text-purple-200">{type}</p>
                    </div>
                    <div className="pt-2">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-1">
                        Year
                        </h2>
                        <p className="text-lg text-purple-200">{year}</p>
                    </div>
                    <div className="pt-2">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-1">
                        Languages / Tech Stack
                        </h2>
                        <p className="text-lg text-purple-200">{languages}</p>
                    </div>
                    <div className="pt-4">
                        <Button click={() => NewTab(github)} variant="default" className="w-40">
                        <div className="flex flex-row justify-center">
                            <img src="../public/logos/github.png" alt="GitHub" className="w-8 mr-4"/>
                            <p className="self-center">GitHub</p> 
                        </div>
                        </Button>
                    </div>
                    </div>
                    <div className="w-full md:w-1/2"> 
                    {/* Project Description */}
                    <div>
                        <p className="leading-relaxed text-gray-200 pt-5">
                        {description}
                        </p>
                    </div>
                    {user && user.isadmin && (
                        <div className="flex flex-col md:flex-row p-4">
                        <div className="px-4 w-full md:w-1/2 mb-2 md:mb-0">
                            <Button click={() => handleEdit()} variant="default" className="w-full h-12">
                            <div className="flex flex-row justify-center">
                                <p className="self-center">Update</p> 
                            </div>
                            </Button>
                        </div>
                        <div className="px-4 w-full md:w-1/2">
                            <Button click={() => handleDelete()} variant="default" className="w-full h-12">
                            <div className="flex flex-row justify-center">
                                <p className="self-center">Delete</p> 
                            </div>
                            </Button>
                        </div>
                        </div>
                    )}
                    </div>
                </div>
                </div>

                {/* Extra Images Section */}
                {extraImages.length > 0 && (
                <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-1 gap-4">
                    {extraImages.map((imgPath, index) => (
                    <img
                        key={index}
                        src={imgPath}
                        alt={`${name} extra ${index + 1}`}
                        className="rounded-4xl shadow-md object-contain"
                    />
                    ))}
                </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Project;