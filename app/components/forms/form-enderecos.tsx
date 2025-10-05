"use client";
import { IMaskInput } from "react-imask";
import { Icon } from "@iconify/react";
import EnderecoCard from "../ui/endereco-card";
import Input from "../ui/input";
import Button from "../ui/button";

type Endereco = {
  id: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
  cep: string;
  complemento: string;
  is_padrao: boolean;
};

interface EnderecoFormProps {
  titulo: string;
  endereco: Endereco;
  isEditando: boolean;
  isNovo?: boolean;
  onChange: (campo: keyof Endereco, valor: string | boolean) => void;
  onSalvar: () => void;
  onCancelar: () => void;
  onEditar?: () => void;
  onExcluir?: () => void;
}

export default function EnderecoForm({
  titulo,
  endereco,
  isEditando,
  isNovo = false,
  onChange,
  onSalvar,
  onCancelar,
  onEditar,
  onExcluir,
}: EnderecoFormProps) {

  return (
    <EnderecoCard className="mb-6 lg:mb-0 w-full lg:w-[74%]">
      <div className="text-start">
        <div className="w-full flex items-center justify-between mb-4">
          <h2 className="text-brown-tertiary text-lg font-secondary font-bold">
            {titulo}
          </h2>

          {!isNovo && (
            <div className="flex gap-4">
              {!isEditando && (
                <>
                  <button type="button" onClick={onEditar}>
                    <Icon
                      icon="material-symbols-light:edit-square-outline-rounded"
                      className="text-3xl text-brown-tertiary"
                    />
                  </button>
                  <button type="button" onClick={onExcluir}>
                    <Icon
                      icon="bi:trash3"
                      className="text-2xl text-brown-tertiary"
                    />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Conteúdo do formulário */}
        <div className="flex flex-col gap-5">
          {/* Rua */}
          <div className="flex flex-col items-start justify-center">
            <Input
              id={`rua-${endereco.id || "novo"}`}
              variant="secondary"
              className="py-2"
              type="text"
              placeholder="Rua"
              value={endereco.rua}
              readOnly={!isEditando}
              onChange={(e) => onChange("rua", e.target.value)}
            />
          </div>

          {/* CEP e Número */}
          <div className="flex flex-row items-center gap-2 w-full">
            <div className="flex flex-col items-start justify-center w-1/2">
              {isEditando ? (
                <IMaskInput
                  mask="00000-000"
                  value={endereco.cep}
                  id={`cep-${endereco.id || "novo"}`}
                  onAccept={(value: any) => onChange("cep", value)}
                  className="text-xs sm:text-sm w-full py-2 px-3 bg-transparent text-brown-tertiary/75 placeholder:text-brown-tertiary/75 rounded-lg border border-brown-tertiary"
                  placeholder="CEP"
                />
              ) : (
                <Input
                  id={`cep-${endereco.id || "novo"}`}
                  variant="secondary"
                  className="py-2"
                  type="text"
                  value={endereco.cep}
                  readOnly
                />
              )}
            </div>
            <div className="flex flex-col items-start justify-center w-1/2">
              {isEditando ? (
                <IMaskInput
                  mask="00000"
                  value={endereco.numero}
                  id={`numero-${endereco.id || "novo"}`}
                  onAccept={(value: any) => onChange("numero", value)}
                  className="text-xs sm:text-sm w-full py-2 px-3 bg-transparent text-brown-tertiary/75 placeholder:text-brown-tertiary/75 rounded-lg border border-brown-tertiary"
                  placeholder="Número"
                />
              ) : (
                <Input
                  id={`numero-${endereco.id || "novo"}`}
                  variant="secondary"
                  className="py-2"
                  type="text"
                  value={endereco.numero}
                  readOnly
                />
              )}
            </div>
          </div>

          {/* Bairro e Complemento */}
          <div className="flex flex-row items-center gap-2 w-full">
            <div className="flex flex-col items-start justify-center w-1/2">
              <Input
                id={`bairro-${endereco.id || "novo"}`}
                variant="secondary"
                className="py-2"
                type="text"
                placeholder="Bairro"
                value={endereco.bairro}
                readOnly={!isEditando}
                onChange={(e) => onChange("bairro", e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start justify-center w-1/2">
              <Input
                id={`complemento-${endereco.id || "novo"}`}
                variant="secondary"
                className="py-2"
                type="text"
                placeholder="Complemento"
                value={endereco.complemento}
                readOnly={!isEditando}
                onChange={(e) => onChange("complemento", e.target.value)}
              />
            </div>
          </div>

          {/* Cidade e Estado */}
          <div className="flex flex-row items-center gap-2 w-full">
            <div className="flex flex-col items-start justify-center w-2/3">
              <Input
                id={`cidade-${endereco.id || "novo"}`}
                variant="secondary"
                className="py-2"
                type="text"
                placeholder="Cidade"
                value={endereco.cidade}
                readOnly={!isEditando}
                onChange={(e) => onChange("cidade", e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start justify-center w-1/3">
              <Input
                id={`estado-${endereco.id || "novo"}`}
                variant="secondary"
                className="py-2"
                type="text"
                placeholder="Estado"
                value={endereco.estado}
                readOnly={!isEditando}
                onChange={(e) => onChange("estado", e.target.value)}
              />
            </div>
          </div>

          {/* Checkbox e botões */}
          <div className="flex items-start justify-between pt-2">
            <div className="flex items-center gap-2">
              <input
                id={`is_padrao-${endereco.id || "novo"}`}
                type="checkbox"
                checked={endereco.is_padrao}
                disabled={!isEditando}
                onChange={(e) => onChange("is_padrao", e.target.checked)}
                className="w-4 h-4 bg-gray-100 rounded accent-brown-primary"
              />
              <label
                htmlFor={`is_padrao-${endereco.id || "novo"}`}
                className="text-brown-tertiary font-medium"
              >
                Salvar endereço como padrão
              </label>
            </div>

            {isEditando && (
              <div className="flex gap-4">
                <Button
                  variant="quaternary"
                  onClick={onSalvar}
                  className="py-2 font-medium text-sm"
                >
                  Salvar
                </Button>
                <button
                  onClick={onCancelar}
                  className="text-brown-primary font-medium text-sm hover:underline"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </EnderecoCard>
  );
}
