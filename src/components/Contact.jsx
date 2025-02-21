import React, { useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
    throw new Error("Missing BASE_URL environment variable.");
}

function Contact(){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");
        try {
            const response = await fetch(`${BASE_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setStatus("Message sent successfully!");
                setFormData({ name: "", email: "", message: "" });
            } else {
                const data = await response.json();
                setStatus(data.error || "An error occurred.");
            }
        } catch (error) {
            console.error(error);
            setStatus("An error occurred while sending your message.");
        }
    };

    return (
        <div id="contact" className="flex justify-center items-center min-h-screen text-white">
            <div className="w-full max-w-lg p-6 bg-purple-900 rounded-2xl shadow-lg text-center">
                <h1 className="text-4xl font-bold mb-2 relative inline-block">
                    Contact
                    <span className="absolute left-0 bottom-0 w-full h-1 bg-purple-400"></span>
                </h1>
                <p className="text-gray-300 mb-6">
                    Have a question or want to work together? Leave your details and I’ll get back to you as soon as possible.
                </p>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="name"
                        placeholder="Name" 
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 bg-purple-800 text-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 mb-4 bg-purple-800 text-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                    <textarea 
                        name="message"
                        placeholder="Message" 
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-3 h-32 bg-purple-800 text-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    ></textarea>
                    <button 
                        type="submit" 
                        className="w-full mt-4 py-3 text-lg font-semibold bg-purple-500 hover:bg-purple-400 text-white rounded-lg shadow-md transition duration-300"
                    >
                        SUBMIT
                    </button>
                </form>
                {status && <p className="mt-4 text-gray-300">{status}</p>}
            </div>
        </div>
    );
};

export default Contact;