"use client"

import { useState } from "react";
import { authClient } from "../lib/auth-client"
import { LoginForm, RegisterForm } from "../components/auth-forms";

export default function Home() {

  const { data: session, isPending: isLoading } = authClient.useSession();
  const [activeForm, setActiveForm] = useState<"login" | "register">("login");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    )
  }

  if (session) {
    return (
      <div className="container mx-auto p-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold">Welcome, {session.user.name}!</h1>
          <p className="text-gray-600">You are successfully logged in.</p>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => authClient.signOut()}>
            Logout
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="">
          <button onClick={() => setActiveForm("login")}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ${activeForm === "login" ? "bg-blue-700" : ""}`}>
            Sign In
          </button>
          <button onClick={() => setActiveForm("register")}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ${activeForm === "register" ? "bg-blue-700" : ""}`}>
            Sign Up
          </button>
        </div>
      </div>
      {activeForm === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  )
}
