'use client'

import Sidebar from "@/app/components/admin/dashboard/sidebar/sidebar";
import PrivateAdminRoute from "@/app/components/private/private-admin-route";
import { AdminAuthProvider } from "@/app/context/authAdminContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <PrivateAdminRoute>
        <div className="flex min-h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-[320px]">
            <Sidebar />
          </div>
          <div className="flex-grow md:overflow-y-auto bg-beige-primary text-brown-secodary h-full">
            {children}
          </div>
        </div>

      </PrivateAdminRoute>
      <ToastContainer position="top-center" />
    </AdminAuthProvider>
  );
}
