"use client";

import CheckoutCard from "../../ui/checkout-card";
import Button from "../../ui/button";
import { IMaskInput } from 'react-imask';

type FormDataFrete = {
  tipo: string;
  valor: number;
};

export default function FreteForm({
  data,
  onChange,
  onNext,
  disabled,
}: {
  data: FormDataFrete;
  onChange: (data: FormDataFrete) => void;
  onNext: () => void;
  disabled?: boolean;
}) {
  const handleNext = () => {
    if (data.tipo) onNext();
  };

  return (
    <div>
      <div className="w-full flex items-center justify-between pb-5">
        <h1 className="hidden lg:block font-secondary text-brown-tertiary font-bold text-lg">
          Frete
        </h1>
      </div>
      <CheckoutCard className="h-[440px] justify-between">
        <div className="flex flex-col gap-8 pb-14">
            <div className="flex flex-col items-start justify-center">
            <label htmlFor="rua" className="text-brown-tertiary font-semibold">Informe seu CEP:</label>
            <IMaskInput
                mask="00000-000"
                type="text"
                disabled={disabled}
                className="text-xs sm:text-sm w-full py-2 px-3 bg-transparent text-brown-tertiary/75 placeholder:text-brown-tertiary/75 rounded-lg border border-brown-tertiary"
                placeholder="CEP"
              />
            </div>
            <div className="flex flex-col gap-3">
            <div className="flex items-center  p-3 text-brown-tertiary rounded-lg shadow-[0px_2px_14px_0px_rgb(00,00,00,0.1)]">
                <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <input
                    type="radio"
                    name="frete"
                    value="sedex"
                    checked={data.tipo === "sedex"}
                    onChange={() => onChange({ tipo: "sedex", valor: 20 })}
                    disabled={disabled}
                    className="size-4 cursor-pointer appearance-none rounded-full border border-brown-tertiary checked:bg-brown-tertiary transition-all checked:ring-2 checked:ring-inset checked:ring-white"
                    />
                    <div className="flex flex-col items-start">
                    <h2 className="font-primary text-[10px]">SEDEX</h2>
                    <p className="text-[10px] font-medium">Até 5 dias úteis</p>
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-bold">
                    R$21,29
                    </p>
                </div>
                </div>
            </div>
            <div className="flex items-center  p-3 text-brown-tertiary rounded-lg shadow-[0px_2px_14px_0px_rgb(00,00,00,0.1)]">
                <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <input
                    type="radio"
                    name="frete"
                    value="pac"
                    checked={data.tipo === "pac"}
                    onChange={() => onChange({ tipo: "pac", valor: 20 })}
                    disabled={disabled}
                    className="size-4 cursor-pointer appearance-none rounded-full border border-brown-tertiary checked:bg-brown-tertiary transition-all checked:ring-2 checked:ring-inset checked:ring-white"
                    />
                    <div className="flex flex-col items-start">
                    <h2 className="font-primary text-[10px]">PAC</h2>
                    <p className="text-[10px] font-medium">Até 10 dias úteis</p>
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-bold">
                    R$18,49
                    </p>
                </div>
                </div>
            </div>
            <div className="flex items-center  p-3 text-brown-tertiary rounded-lg shadow-[0px_2px_14px_0px_rgb(00,00,00,0.1)]">
                <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <input
                    type="radio"
                    name="frete"
                    value="jadlog"
                    checked={data.tipo === "jadlog"}
                    onChange={() => onChange({ tipo: "jadlog", valor: 20 })}
                    disabled={disabled}
                    className="size-4 cursor-pointer appearance-none rounded-full border border-brown-tertiary checked:bg-brown-tertiary transition-all checked:ring-2 checked:ring-inset checked:ring-white"
                    />
                    <div className="flex flex-col items-start">
                    <h2 className="font-primary text-[10px]">JADLOG</h2>
                    <p className="text-[10px] font-medium">Até 7 dias úteis</p>
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-bold">
                    R$23,80
                    </p>
                </div>
                </div>
            </div>
            </div>
        </div>
        <Button
          variant="quaternary"
          onClick={handleNext}
          disabled={disabled || !data.tipo}
          className="py-2 font-medium"
        >
          Avançar
        </Button>
      </CheckoutCard>
    </div>
  );
}
