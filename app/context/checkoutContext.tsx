"use client";

import { createContext, useContext} from "react";


const CheckoutContext = createContext<any>(null);

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  



  return (
    <CheckoutContext.Provider value={{}}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout deve ser usado dentro de CheckoutProvider");
  return context;
};
