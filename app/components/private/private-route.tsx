"use client";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/app/context/authContext";
import { useEffect, useState } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setIsRedirecting(true);
      router.push("/");
    }
  }, [user, loading]);

  if (loading || isRedirecting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="mr-4 text-lg">Carregando...</p>
        <span className="animate-spin rounded-full border-4 border-brown-primary border-t-transparent size-8"></span>
      </div>
    );
  }

  return <>{children}</>;
}
