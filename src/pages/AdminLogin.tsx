import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("mdesaalli74@gmail.com");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "mdesaalli74@gmail.com" && password === "mdesa1111") {
      toast.success("Welcome Admin!");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans max-w-md mx-auto shadow-xl">
      <div className="w-full space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-200">
            A
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Admin Login</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-indigo-600 font-bold text-sm hover:underline"
          >
            Back to App
          </button>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold rounded-xl p-4 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
