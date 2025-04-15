"use client";

import { Fetch } from "@/hooks/apiUtils";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextProps {
  user: any;
  token: string | null;
  login: (token: string, userData: object) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<object | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    navigate.prefetch("/dashboard/pages");
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async (sharedToken: string) => {
      try {
        const endpoint = "api/auth/user/get-current-user";
        const response: { success: boolean; data: any; message: string } =
          await Fetch(endpoint, {}, 5000, true, false);
        console.log(response);
        if (response?.success && response?.data) {
          setLoading(false);
          setToken(sharedToken);
          setUser(response?.data);
          return navigate.replace("/dashboard/pages");
        } else return navigate.replace("/auth/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
        localStorage.clear();
        return navigate.replace("/auth/login");
      }
    };
    const sharedToken = localStorage.getItem("adminToken");
    if (sharedToken) fetchUser(sharedToken);
    else setLoading(false);
  }, [navigate]);

  const login = (token: string, userData: object) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("adminToken", token);
    return navigate.push("/dashboard/pages");
  };

  const logout = () => {
    setToken(null);
    setUser({});
    localStorage.clear();
    return navigate.replace("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
