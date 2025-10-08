import { cn } from "@/app/lib/utils";
import React from "react"; // Importar React para React.HTMLAttributes

export default function CheckoutCard({
  children,
  disabled = false, // 1. Adicionar a prop 'disabled' com valor padrão false
  ...props
}: {
  children: React.ReactNode;
  disabled?: boolean; // Tipagem para a nova prop
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        ` 
          shadow-none lg:shadow-[2px_12px_44px_2px_rgb(00,00,00,0.1)] rounded-lg px-6 py-8 bg-beige-primary 
          flex flex-col text-center justify-center
          relative`, // 'relative' é crucial para posicionar o overlay
        props.className,
        {
          "opacity-60 pointer-events-none": disabled, // Diminui a opacidade e impede cliques (se for o caso)
        }
      )}
    >
      {children}
      
      {/* 3. Adicionar uma camada (overlay) acinzentada por cima */}
      {disabled && (
        <div
          className="
            absolute inset-0 
            bg-gray-200 opacity-10 
            rounded-lg 
            z-10 // Garante que fique por cima
          "
        />
      )}
    </div>
  );
}