"use client";

import Image from "next/image";
import { useState } from "react";
import { Post } from "@/hooks/apiUtils";
import { useAuth } from "@/context/AuthContext";
import { IoEye, IoEyeOff, IoLogInOutline } from "react-icons/io5";

const Login: React.FC = () => {
  const { token, login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: any = await Post(
        "/api/auth/admin/login",
        { email, password },
        5000
      );
      if (response?.success) {
        const token = response?.data?.token;
        const adminDetails = response?.data?.data;
        login(token, adminDetails);
      }
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  return (
    <>
      {!token && (
        <div className="relative min-h-screen flex justify-center items-center bg-[#138fff]">
          {/* Video Background */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
          >
            <source src="/assets/bg/heroSection.mp4" type="video/mp4" />
          </video>

          {/* Overlay for better readability */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

          {/* Glassmorphic Form Container */}
          <div className="relative bg-white/20 backdrop-blur-lg p-8 rounded-xl max-w-md w-full">
            {/* Logo */}
            <div className="text-center mb-6">
              <Image
                src="/assets/bg/logo.png"
                alt="logo"
                width={150}
                height={100}
                priority
                unoptimized
                className="mx-auto"
              />
            </div>
            <h2 className="text-white text-center text-2xl font-semibold mb-6">
              Welcome Back
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-white text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-white text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span
                    className="absolute top-3 right-3 cursor-pointer text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <IoEye size={18} />
                    ) : (
                      <IoEyeOff size={18} />
                    )}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-md transition"
              >
                <IoLogInOutline size={20} />
                Proceed to Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
