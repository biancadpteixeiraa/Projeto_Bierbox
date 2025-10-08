"use client";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function FAQ() {
  const perguntas = [
    {
      id: 1,
      pergunta: "O que é a BierBox?",
      resposta:
        "A Bierbox é uma plataforma de assinaturas de chopes e cervejas artesanais produzidas por cevejarias locais da cidade de Guarapuava - Pr",
    },
    {
      id: 2,
      pergunta: "Como funciona a assinatura?",
      resposta:
        "Você escolhe seu plano, seleciona a quantidade de chopes e recebe em casa todo mês sem preocupação.",
    },
    {
      id: 3,
      pergunta: "Posso cancelar quando quiser?",
      resposta: "Sim, você pode cancelar sua assinatura a qualquer momento com uma taxa extra.",
    },
    {
      id: 4,
      pergunta: "Tem taxa de entrega?",
      resposta:
        "A taxa depende da sua região, mas mostramos o valor antes de fechar o pedido.",
    },
    {
      id: 5,
      pergunta: "Os chopes são artesanais?",
      resposta: "Sim, todos são artesanais, produzidos por cervejarias locais de Guarapuava.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col items-start lg:px-16 px-6 pb-16 pt-4 font-primary text-brown-primary h-full">
      <h1 className="text-xl pb-6">FAQ - PERGUNTAS FREQUENTES:</h1>
      <div className="flex flex-col md:flex-row justify-between w-full">
        <div className="flex flex-col w-full lg:w-1/2 justify-center">
          {perguntas.map((pergunta) => (
            <div
              key={pergunta.id}
              className="border-2 border-brown-tertiary rounded-xl my-4"
            >
              <Disclosure as="div">
                {({ open }) => (
                  <div>
                    <h2>
                      <DisclosureButton className="py-3 w-full text-start px-6 flex items-center justify-between">
                        {pergunta.pergunta}
                        <ChevronDownIcon
                          aria-hidden="true"
                          className={`size-7 text-brown-primary transition-transform duration-300 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </DisclosureButton>
                    </h2>
                    <DisclosurePanel className="text-brown-tertiary font-medium font-secondary px-6 pt-3 pb-6">
                      {pergunta.resposta}
                    </DisclosurePanel>
                  </div>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end w-full lg:w-1/2">
          <img src="/faq.png" alt="Ilustração de duas pessoas olhando um grande ponto de interrogação" className="md:size-[500px] size-auto" />
        </div>
      </div>
    </div>
  );
}
