import React, { useEffect, useRef, useState } from "react";
import { MessageList, Input, Button } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import '../../public/Chatbot.css';
import ReactMarkdown from 'react-markdown';


const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
    throw new Error("Missing BASE_URL environment variable.");
}

export function Chatbot() {
    const threadId = useRef(undefined);
    const [runId, setRunId] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const scrollContainer = useRef(null);
    
    // Creates or reuses a chat thread
    async function createThread() {
        if (!threadId.current) {
            const storedThreadId = localStorage.getItem("threadId");
            if (storedThreadId) {
                threadId.current = storedThreadId;
                await updateMessages();
            }
        }
        if (threadId.current) return;
    
        const response = await fetch(`${BASE_URL}/chat/new`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        threadId.current = data.threadId;
        localStorage.setItem("threadId", threadId.current);
    }
    
    // Sends a message to the backend
    async function sendMessage(text) {
        if (runId) return;
        const response = await fetch(`${BASE_URL}/chat/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                threadId: threadId.current,
                text,
            }),
            credentials: "include",
        });
        const data = await response.json();
        setRunId(data.runId);
    }
    
    // Poll the backend for new messages
    async function updateMessages() {
        const response = await fetch(`${BASE_URL}/chat/list`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                threadId: threadId.current,
                runId,
            }),
            credentials: "include",
        });
        const data = await response.json();
        const msgs = data.messages.reverse();
        setMessages(msgs);
    
        if (runId && data.status === "completed") {
            setRunId(undefined);
            setIsLoading(false);  // Stop loading when response is complete
        }
    }
    
    // Immediately show the user's message in local state, then send
    async function handleSend() {
        const trimmed = inputText.trim();
        if (!trimmed) return;
    
        // Show user message and loading immediately
        setMessages(prev => [...prev, { role: "user", content: trimmed }]);
        setInputText("");
        setIsLoading(true);
    
        try {
            await sendMessage(trimmed);
        } catch (error) {
            console.error("Failed to send message:", error);
            setIsLoading(false);
        }
    }
    
    // On mount, create or load a thread
    useEffect(() => {
        createThread().catch((err) => {
            console.error("Failed to create message thread.", err);
        });
    }, []);
    
    // Poll for new messages while a run is active
    useEffect(() => {
        if (runId === undefined) return;
        const timer = setInterval(() => {
            updateMessages().catch(console.error);
        }, 1000);
        return () => clearInterval(timer);
    }, [runId]);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
        }
    }, [messages]);
    
    
    function parseContent(content) {
        let text;
        if (typeof content === "string") {
            text = content;
        } else if (content && typeof content === "object") {
            if (content[0]?.text?.value) {
                text = content[0].text.value;
            } else {
                text = JSON.stringify(content);
            }
        }
        
        // Remove unwanted patterns
        text = text.replace(/【\d+:\d+†source】/g, "");
        
        return text;
    }
    
    return (
        <>
            {/* Toggle Chat */}
            <button
                style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    padding: "10px 16px",
                    backgroundColor: "#6366F1", // Purple
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                }}
                onClick={() => setIsOpen(!isOpen)}
                >
                {isOpen ? "Hide Chat" : "Show Chat"}
            </button>
    
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 80,
                        right: 20,
                        width: 320,
                        height: 480,
                        backgroundColor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 10,
                        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                        color: "#000",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            backgroundColor: "#6366F1",
                            color: "#fff",
                            padding: "10px",
                            fontWeight: "bold",
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        }}
                    >
                        Portfolio Chatbot
                    </div>
        
                    {/* Messages Area */}
                    <div ref={scrollContainer} style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    margin: '8px 0'
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '70%',
                                        padding: '8px 12px',
                                        borderRadius: '12px',
                                        backgroundColor: msg.role === 'user' ? '#007BFF' : '#F0F0F0',
                                        color: msg.role === 'user' ? 'white' : 'black',
                                }}
                                >
                                    <ReactMarkdown
                                        children={parseContent(msg.content)}
                                        components={{
                                        a: ({ href, children }) => (
                                            <a 
                                            href={href} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            style={{ 
                                                color: msg.role === 'user' ? '#A3D8FF' : '#0066CC',
                                                textDecoration: 'underline',
                                                fontWeight: '500',
                                            }}
                                            >
                                                {children}
                                            </a>
                                        )
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                margin: '8px 0'
                            }}>
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    backgroundColor: '#F0F0F0',
                                }}>
                                    <div className="loading-dots">
                                        <div className="dot-flashing"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
        
                    {/* Input Area */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px",
                            borderTop: "1px solid #ccc",
                            gap: "8px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSend();
                            }
                            }}
                            style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: 4,
                            border: "1px solid #ccc",
                            color: "#000",
                            }}
                        />
                        <button
                            onClick={handleSend}
                            style={{
                            padding: "8px 12px",
                            backgroundColor: "#E2E2E2",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            cursor: "pointer",
                            color: "#000",
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Chatbot;