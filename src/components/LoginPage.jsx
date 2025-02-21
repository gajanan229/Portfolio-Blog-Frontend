import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header";

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
    throw new Error("Missing BASE_URL environment variable.");
}

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/api/login`, {
                method: 'POST',
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if(response.ok){
                const data = await response.json();
                console.log('Logged in user:', data);
                navigate('/');
            } else {
                const errData = await response.json();
                alert(errData.message || 'Login failed');
            }
        } catch(error) {
            console.error('Error during login', error);
        }
    };

    return (
        <div>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
                <h1 className="text-4xl text-white mb-8">Login</h1>
                <form onSubmit={handleSubmit} className="w-full max-w-sm">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-white mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-white mb-2">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-3 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};
    
export default LoginPage;