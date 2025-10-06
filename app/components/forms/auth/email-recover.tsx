'use client'
import Button from "../../ui/button";
import Input from "../../ui/input";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";

export default function EmailRecover() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loadingRecover, setLoadingRecover] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; senha?: string } = {};
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Informe um email válido.";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoadingRecover(true);
    await forgotPassword(email);
    setLoadingRecover(false);
    };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-10">
      <div>
        <label
          htmlFor="email"
          className="pb-2 font-secondary text-gray-tertiary text-xs sm:text-sm"
        >
          Informe seu e-mail:
        </label>
        <Input
          id="email"
          type="email"
          placeholder="E-mail aqui"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loadingRecover}
        className="w-full py-4 font-medium text-lg flex items-center justify-center"
        variant="quaternary"
      >
        {loadingRecover ? (
          <svg
            className="animate-spin h-5 w-5 mr-3 text-white"
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
        ) : (
          "Enviar link de recuperação"
        )}
      </Button>
    </form>
  );
}
