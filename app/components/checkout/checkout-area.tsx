"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import EnderecoForm from "../forms/checkout/endereco-form";
import FreteForm from "../forms/checkout/frete-form";
import ResumoFinanceiro from "../forms/checkout/resumo-financeiro";
import { CheckoutSkeleton } from "../ui/skeletons";
import Link from "next/link";
import Button from "../ui/button";
import { useCheckout } from "@/app/context/checkoutContext";
import { toast } from "react-toastify";


export default function CheckoutArea() {
  const { step, setStep, formData, box, checkoutData, loading } = useCheckout();

  if (loading) {
    return (
      <div className="lg:grid lg:grid-cols-3 lg:gap-6 py-10 lg:py-20 max-w-7xl mx-auto px-6">
        <CheckoutSkeleton />
      </div>
    );
  }

  if (!loading && (!box || !checkoutData)) {
      return (
            <div className="flex flex-col justify-center items-center py-20 text-center px-6">
              <h1 className="text-brown-tertiary md:text-2xl text-xl font-secondary font-bold pb-10">
                Nenhum dado de checkout ou box encontrada!
              </h1>
              <img
              src="/NoAddress.png"
              alt="Sem Assinaturas"
              className="md:w-[550px] w-auto mx-auto md:mb-2 pb-10"
              />
              <Link href="/planos">
                  <Button
                  className="w-64 md:w-96 md:text-lg text-sm"
                  variant="quaternary"
                  >
                  Comprar Agora!
                  </Button>
              </Link>
            </div>
      );
  }
  

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-6 py-10 lg:py-20 max-w-7xl mx-auto px-6">
      {/* Desktop */}
      <div className="hidden lg:block">
        <EnderecoForm/>
      </div>
      <div className="hidden lg:block">
        <FreteForm/>
      </div>
      <div className="hidden lg:block">
        <ResumoFinanceiro/>
      </div>

    {/* Mobile */}
    <div className="flex flex-col lg:hidden gap-6">
      <Disclosure defaultOpen={step === "endereco"}>
        {() => (
          <div className="shadow-[2px_12px_13px_2px_rgb(00,00,00,0.1)] rounded-xl">
            <DisclosureButton
              onClick={() => setStep("endereco")}
              className={`rounded-xl px-6 py-4 w-full flex items-start ${
                step === "endereco" ? "bg-beige-primary" : "bg-gray-100"
              }`}
            >
              <h1 
              className={`font-secondary font-bold text-lg
                ${
                step === "endereco" ? "text-brown-tertiary" : "text-brown-tertiary/75"
                }`}
                >
                Endereço de entrega
              </h1>
            </DisclosureButton>
            {step === "endereco" && (
              <DisclosurePanel static>
                <EnderecoForm />
              </DisclosurePanel>
            )}
          </div>
        )}
      </Disclosure>

      {/* Frete */}
      <Disclosure defaultOpen={step === "frete"}>
        {() => (
          <div className="shadow-[2px_12px_13px_2px_rgb(00,00,00,0.1)] rounded-xl">
            <DisclosureButton
              onClick={() => {
                  if (formData.endereco.rua.trim() === "") {
                    toast.warning("Preencha o endereço antes de continuar");
                    return;
                  }
                  setStep("frete");
                }}
                className={`rounded-xl px-6 py-4 w-full flex items-start ${
                  step === "frete" ? "bg-beige-primary" : "bg-gray-100 text-brown-primary/75"
                }`}
              >
              <h1 
              className={`font-secondary font-bold text-lg ${step === "frete" ? "text-brown-tertiary" : "text-brown-tertiary/75"}`}>
                Frete
              </h1>
            </DisclosureButton>
            {step === "frete" && (
              <DisclosurePanel static>
                <FreteForm/>
              </DisclosurePanel>
            )}
          </div>
        )}
      </Disclosure>

      {/* Resumo Financeiro */}
      <Disclosure defaultOpen={step === "resumo"}>
        {() => (
          <div className="shadow-[2px_12px_13px_2px_rgb(00,00,00,0.1)] rounded-xl">
            <DisclosureButton
              onClick={() => {
                if (formData.frete.tipo.trim() === "") {
                  toast.warning("Selecione um tipo de frete antes de continuar");
                  return;
                }
                setStep("resumo");
              }}
              className={`rounded-xl px-6 py-4 w-full flex items-start ${
                step === "resumo" ? "bg-beige-primary" : "bg-gray-100 text-brown-primary/75"
              }`}
            >
              <h1 className={`font-secondary font-bold text-lg ${step === "resumo" ? "text-brown-tertiary" : "text-brown-tertiary/75"}`}>
                Resumo Financeiro
              </h1>
            </DisclosureButton>
            {step === "resumo" && (
              <DisclosurePanel static>
                <ResumoFinanceiro/>
              </DisclosurePanel>
            )}
          </div>
        )}
      </Disclosure>
    </div>


    </div>
  );
}
