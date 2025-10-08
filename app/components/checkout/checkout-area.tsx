"use client";

import { useCallback, useEffect, useState } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import EnderecoForm from "../forms/checkout/encereco-form";
import FreteForm from "../forms/checkout/frete-form";
import ResumoFinanceiro from "../forms/checkout/resumo-financeiro";
import { getBoxById } from "@/app/services/boxes";
import { useCheckout } from "@/app/context/checkoutContext";


export default function CheckoutArea() {
  const { step, setStep, endereco, setEndereco, frete, setFrete, box, checkoutData } = useCheckout();

  const handleEdit = useCallback((targetStep: "endereco" | "frete" | "resumo") => setStep(targetStep), [setStep]);

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-6 py-10 lg:py-20 max-w-7xl mx-auto px-6">
      {/* Desktop */}
      <div className="hidden lg:block">
        <EnderecoForm
          data={endereco}
          onChange={setEndereco}
          onNext={() => setStep("frete")}
          disabled={step !== "endereco"}
          onEdit={() => handleEdit("endereco")}
        />
      </div>
      <div className="hidden lg:block">
        <FreteForm
          cep={endereco.cep}
          data={frete}
          onChange={setFrete}
          onNext={() => setStep("resumo")}
          disabled={step !== "frete"}
          onEdit={() => handleEdit("frete")}
        />
      </div>
      <div className="hidden lg:block">
        <ResumoFinanceiro 
          data={{ endereco, frete }}
          disabled={step !== "resumo"}
          box={box}
          checkoutData={checkoutData}
        />
      </div>

      {/* Mobile */}
      <div className="flex flex-col lg:hidden gap-6">
        <Disclosure defaultOpen={step === "endereco" || step === "frete" || step === "resumo"}>
          {() => (
            <div className="shadow-[2px_12px_13px_2px_rgb(00,00,00,0.1)] rounded-xl">
              <DisclosureButton className="rounded-xl px-6 py-4 bg-beige-primary w-full flex items-start">
                <h1 className="font-secondary text-brown-tertiary font-bold text-lg">Endereço de entrega</h1>
              </DisclosureButton>
              <DisclosurePanel>
                <EnderecoForm
                  data={endereco}
                  onChange={setEndereco}
                  onNext={() => setStep("frete")}
                  disabled={step !== "endereco"}
                  onEdit={() => handleEdit("endereco")}
                />
              </DisclosurePanel>
            </div>
          )}
        </Disclosure>

        <Disclosure defaultOpen={step === "frete"}>
          {() => (
            <div className="shadow-[2px_12px_13px_2px_rgb(00,00,00,0.1)] rounded-xl">
              <DisclosureButton 
              className={`rounded-xl px-6 py-4 w-full flex items-start ${step === 'endereco' ? 'opacity-50 cursor-not-allowed' : 'bg-beige-primary'}`}
              disabled={step === "endereco"}>
                <h1 className="font-secondary text-brown-tertiary font-bold text-lg">Frete</h1>
              </DisclosureButton>
              {(step === "frete" || step === "resumo") && (
                <DisclosurePanel>
                  <FreteForm
                    cep={endereco.cep}
                    data={frete}
                    onChange={setFrete}
                    onNext={() => setStep("resumo")}
                    disabled={step !== "frete"}
                    onEdit={() => handleEdit("frete")}
                  />
                </DisclosurePanel>
              )}
            </div>
          )}
        </Disclosure>

        <Disclosure defaultOpen={step === "resumo"}>
          {() => (
            <div className="shadow-[2px_12px_13px_2px_rgb(00,00,00,0.1)] rounded-xl">
              <DisclosureButton 
              className={`rounded-xl px-6 py-4 w-full flex items-start ${step !== 'resumo' ? 'opacity-50 cursor-not-allowed' : 'bg-beige-primary'}`}
              disabled={step !== "resumo"}>
                <h1 className="font-secondary text-brown-tertiary font-bold text-lg">Resumo Financeiro</h1>
              </DisclosureButton>
              {step === "resumo" && (
                <DisclosurePanel>
                  <ResumoFinanceiro 
                    data={{ endereco, frete }}
                    disabled={step !== "resumo"}
                    box={box}
                    checkoutData={checkoutData} 
                  />
                </DisclosurePanel>
              )}
            </div>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
