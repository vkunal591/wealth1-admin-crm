import "./globals.css";
import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";
import Sidebar from "@/components/common/Sidebar";
import { AuthProvider } from "@/context/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

export const metadata: Metadata = {
  title: "Wealth1 | Admin Panel",
  description: "Wealth1",
};

// Configure the Poppins font
const poppins = Poppins({
  subsets: ["latin"], // Subset for the characters you need
  weight: ["400", "500", "600", "700"], // Add weights as required
  variable: "--font-poppins", // Optional: for CSS variables
  display: "swap", // Ensures fonts load optimally
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} relative antialiased`}>
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 w-[83%] border-l border-secondary">
              <Navbar />
              <main>{children}</main>
              <div id="modal-root"></div>
              <ToastContainer
                rtl={false}
                autoClose={2000}
                newestOnTop={true}
                position="top-right"
                hideProgressBar={false}
              />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
