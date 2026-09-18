"use client"

import { useState } from "react";
import { authClient } from "../lib/auth-client";

export function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authClient.signIn.email(
                {
                    email,
                    password
                }
            );
        } catch (err) {
            console.error("Error during sign-up:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading}
            >
                {isLoading ? "Signing In..." : "Sign In"}
            </button>
        </form>
    )
}

export function RegisterForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authClient.signUp.email(
                {
                    email,
                    password,
                    name
                }
            );
        } catch (err) {
            console.error("Error during sign-up:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading}
            >
                {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
        </form>
    )
}