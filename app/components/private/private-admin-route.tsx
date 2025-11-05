"use client";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/app/context/authAdminContext";
import { useEffect } from "react";

export default function PrivateAdminRoute({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.push("/admin");
    }
  }, [admin, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return <>{children}</>;
}
