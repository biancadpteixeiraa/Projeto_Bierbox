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
        <svg
          className="animate-spin h-12 w-12 text-yellow-primary"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  return <>{children}</>;
}
