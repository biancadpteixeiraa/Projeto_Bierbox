'use client';

import { AdminAuthProvider } from "@/app/context/authAdminContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      {children}
      <ToastContainer position="top-center" />
    </AdminAuthProvider>
  );
}
