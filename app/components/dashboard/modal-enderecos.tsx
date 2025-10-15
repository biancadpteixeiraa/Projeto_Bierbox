'use client'

import { useAuth } from '@/app/context/authContext';
import { getEnderecos } from '@/app/services/enderecos';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../ui/button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    setSelectedEnderecoId: (id: string) => void;
    selectedEnderecoId: string | null;
  }
  
export default function ModalEnderecos({ isOpen, onClose, onConfirm, setSelectedEnderecoId, selectedEnderecoId}: ModalProps) {

    const { token } = useAuth();
    const params = useParams();
    const id = params.id as string; 
    const [enderecos, setEnderecos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

      useEffect(() => {
        if (!token) return;
        const fetchEnderecos = async () => {
          try {
            const res = await getEnderecos(token);
            setEnderecos(res);
          } catch (err) {
            console.error("Erro ao buscar endereços:", err);
            toast.error("Erro ao carregar endereços.");
          } finally {
            setLoading(false);
          }
        };
        fetchEnderecos();
      }, [token]);

    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
  
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-beige-primary text-left shadow-xl transition-all sm:my-8 sm:w-[440px] sm:max-w-lg">
              <div className="bg-beige-primary px-4 pt-5 pb-4 sm:p-8 sm:pb-4">
                <DialogTitle as="h3" className="sm:text-xl text-lg font-bold text-brown-tertiary text-start pb-6">
                  Endereços Salvos:
                </DialogTitle>
                <div className="flex flex-col gap-4 pb-10">
                  {loading && (
                    <div>
                      Carregando endereços...
                    </div>
                  )}
                  {enderecos.map((endereco) => (
                    <div key={endereco.id} className="flex items-center p-3 py-5 text-brown-tertiary rounded-lg shadow-[0px_2px_14px_0px_rgb(00,00,00,0.1)]">
                      <div className="flex items-start gap-3">
                          <input
                          type="radio"
                          name="endereco"
                          value={endereco.id}
                          checked={selectedEnderecoId === endereco.id}
                          onChange={() => setSelectedEnderecoId(endereco.id)}
                          className="bg-gray-100 mt-1 size-4 cursor-pointer appearance-none rounded-full border border-brown-tertiary checked:bg-brown-tertiary transition-all checked:ring-2 checked:ring-inset checked:ring-white"
                          />
                          <div className="flex flex-col items-start gap-1">
                            <h2 className="text-xs font-bold">
                              {`${endereco.rua}, ${endereco.numero} - ${endereco.bairro}`}
                            </h2>
                            <p className="text-xs font-medium">
                              {`${endereco.cidade} - ${endereco.estado}`}
                            </p>
                            <p className="text-xs font-medium">
                              {`CEP: ${endereco.cep}`}
                            </p>
                          </div>
                      </div>
                    </div>
                  ))}
                  <Link href={`/dashboard/${id}/enderecos`}>
                    <button
                    aria-label="Adicionar novo endereço"
                    className="md:text-sm text-xs text-blue-primary font-bold underline hover:text-blue-hover transition text-center w-full"
                  >
                    + Adicionar Novo Endereço
                    </button>
                  </Link>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex flex-col sm:justify-center sm:px-6 sm:pb-6 gap-3">
                <Button
                  onClick={onConfirm}
                  className="cursor-pointer w-full font-medium text-lg"
                >
                  Salvar Endereço
                </Button>
                <Button
                variant='tertiary'
                  onClick={onClose}
                  className="cursor-pointer w-full font-medium text-lg border-2"
                >
                  Cancelar
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    )
  }
