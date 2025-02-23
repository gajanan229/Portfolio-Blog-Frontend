import React, { useEffect, useState } from 'react';
import { Button } from "./ui/Button";
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
    throw new Error("Missing BASE_URL environment variable.");
}

function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async (retryCount = 0) => {
            try {
                const res = await fetch(`${BASE_URL}/api/current-user`, {
                    credentials: 'include'
                });
                
                if (res.status === 401) {
                    setUser(null);
                    return;
                }

                if (!res.ok) throw new Error('Failed to fetch user');

                const userData = await res.json();
                setUser(userData)
            } catch (err) {
                console.error(err);
                if (retryCount < 3) {
                    setTimeout(() => fetchCurrentUser(retryCount + 1), 1000 * (retryCount + 1));
                }
            }
        };
        fetchCurrentUser();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                setUser(null);
                navigate('/');
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleScroll = (sectionId) => {
        navigate("/");
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleRoute = (loc) => {
        navigate(loc);
    };

    const ResumeButton = () => {
        window.open("/Gajanan_Vigneswaran_Resume.pdf");
    };

    return (
        <header className="bg-gray-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Left Column: */}
                <div className="w-1/3 flex items-center">
                    {/* Desktop: Logo on left */}
                    <div className="hidden md:block">
                        <Button 
                            variant="ghost" 
                            className="text-purple-500 text-2xl font-bold" 
                            click={() => handleRoute("/")}
                        >
                            Gajanan V
                        </Button>
                    </div>
                    {/* Mobile: Hamburger menu */}
                    <div className="block md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white hover:text-purple-500 focus:outline-none"
                        >
                            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                                <path
                                    d="M4 5h16M4 12h16M4 19h16"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Center Column: */}
                <div className="w-1/3 flex justify-center">
                    {/* Desktop: Navigation */}
                    <div className="hidden md:block">
                        <nav className="flex space-x-8 text-base font-medium">
                            <button onClick={() => handleScroll("about")} className="hover:text-purple-500">About</button>
                            <button onClick={() => handleScroll("projects")} className="hover:text-purple-500">Projects</button>
                            <button onClick={() => handleScroll("contact")} className="hover:text-purple-500">Contact</button>
                            <button onClick={() => handleScroll("work")} className="hover:text-purple-500">Work</button>
                            <Button click={ResumeButton} variant="ghost" className="text-purple-500">Resume</Button>
                            {user && user.isadmin && (
                                <>
                                    <button onClick={() => handleRoute("/add-project")} className="hover:text-purple-500">Add Project</button>
                                    <button onClick={() => handleRoute("/rank-project")} className="hover:text-purple-500">Rank Projects</button>
                                </>
                            )}
                        </nav>
                    </div>
                    {/* Mobile: Logo in center */}
                    <div className="block md:hidden">
                        <Button 
                            variant="ghost" 
                            className="text-purple-500 text-2xl font-bold" 
                            click={() => handleRoute("/")}
                        >
                            Gajanan V
                        </Button>
                    </div>
                </div>

                {/* Right Column: Auth Buttons */}
                <div className="w-1/3 flex justify-end">
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <Button 
                                variant="default" 
                                className="bg-purple-500 text-white hover:bg-purple-600" 
                                click={handleLogout}
                            >
                                Logout
                            </Button>
                            ) : (
                            <>
                                <Button 
                                click={() => handleRoute("/login")} 
                                variant="ghost" 
                                className="text-white hover:text-purple-500"
                                >
                                Log In
                                </Button>
                                <Button 
                                click={() => handleRoute("/signup")} 
                                variant="default" 
                                className="bg-purple-500 text-white hover:bg-purple-600"
                                >
                                Sign Up
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu for Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden px-4 pb-4">
                    <nav className="flex flex-col space-y-2">
                        <button onClick={() => { handleScroll("about"); setIsMobileMenuOpen(false); }} className="hover:text-purple-500 text-left">About Me</button>
                        <button onClick={() => { handleScroll("projects"); setIsMobileMenuOpen(false); }} className="hover:text-purple-500 text-left">Projects</button>
                        <button onClick={() => { handleScroll("contact"); setIsMobileMenuOpen(false); }} className="hover:text-purple-500 text-left">Contact</button>
                        <button onClick={() => { handleScroll("work"); setIsMobileMenuOpen(false); }} className="hover:text-purple-500 text-left">Work</button>
                        {user && user.isadmin && (
                            <>
                                <button onClick={() => { handleRoute("/add-project"); setIsMobileMenuOpen(false); }} className="hover:text-purple-500 text-left">Add Project</button>
                                <button onClick={() => { handleRoute("/rank-project"); setIsMobileMenuOpen(false); }} className="hover:text-purple-500 text-left">Rank Projects</button>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;