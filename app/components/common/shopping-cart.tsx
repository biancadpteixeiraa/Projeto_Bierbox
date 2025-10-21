"use client"

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Refrigerator, X } from 'lucide-react';
import Button from '../ui/button';
import { useCarrinho } from '@/app/context/cartContext';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useCheckout } from '@/app/context/checkoutContext';
import { useRouter } from 'next/navigation';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { carrinho, loadCarrinho, removeItem } = useCarrinho();
  const { setCheckoutData } = useCheckout();
  const router = useRouter();

  const [loadingComprar, setLoadingComprar] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCarrinho();
    }
  }, [isOpen]);


  const total = useMemo(() => {
    if (!carrinho?.itens?.length || !selectedBoxId) return "0,00";

    const selectedItem = carrinho.itens.find((i) => i.box_id === selectedBoxId);
    if (!selectedItem) return "0,00";

    const price = parseFloat(selectedItem.preco_unitario.replace(',', '.')) || 0;
    return price.toFixed(2).replace('.', ',');
  }, [carrinho, selectedBoxId]);

  const handleRemoveItem = async (boxId: string) => {
    try {
      setRemovingItemId(boxId);
      await removeItem(boxId);
    } catch (error) {
      toast.error("Erro ao remover item.");
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleFinalizarPedido = () => {
    if (!selectedBoxId) {
      toast.error("Selecione uma box antes de finalizar o pedido!");
      return;
    }

  const selectedItem = carrinho?.itens.find((i) => i.box_id === selectedBoxId);

  if (!selectedItem) {
    toast.error("Ocorreu um erro ao identificar a box selecionada.");
    return;
  }

  try {
      setLoadingComprar(true);
      setCheckoutData({
        boxId: selectedItem.box_id,
        plano: selectedItem.tipo_plano === "anual" ? "anual" : "mensal",
        quantidade: selectedItem.quantidade === 6 ? 6 : 4,
      });
      router.push("/checkout");
  } finally {
      setLoadingComprar(false);
  }
};


  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-40 font-secondary">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="flex items-start justify-between sm:px-6 pb-3">
                    <div className='flex items-center pr-4 lg:pr-0'>
                      <Refrigerator fill='#654A1F' className="size-10 text-beige-primary" />
                      <span className='flex items-center justify-center text-xs bg-brown-tertiary text-beige-primary rounded-full min-w-[20px] h-5 px-1 font-medium -ml-1'>
                        {carrinho?.itens?.length || 0}
                      </span>
                      <DialogTitle className="text-lg font-bold text-brown-tertiary px-5">
                        Minha Geladeira:
                      </DialogTitle>
                    </div>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={onClose}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>
                  <hr className="h-[1.5px] w-full bg-brown-tertiary" />
                  <div className="mt-8 sm:px-6">
                    <div className="flow-root">
                      <ul role="list" className="-my-6">
                        {carrinho?.itens && carrinho.itens.length > 0 ? (
                          carrinho.itens.map((item) => (
                            <li key={item.id} className="flex py-6">
                              <div className='flex items-center gap-2'>
                                <input
                                  id="itemCarrinho"
                                  type="checkbox"
                                  checked={selectedBoxId === item.box_id} 
                                  onChange={() => setSelectedBoxId(selectedBoxId === item.box_id ? null : item.box_id)}
                                  className="w-4 h-4 bg-gray-100 rounded accent-brown-primary"
                                />
                                <div className="size-24 shrink-0 relative flex flex-col items-center justify-center">
                                    <img
                                      alt={item.nome}
                                      src={item.imagem_principal_url}
                                      className="size-full object-cover rounded-md border-yellow-tertiary border"
                                    />
                                    <p className='w-20 text-[8px] font-secondary font-bold px-1 py-1 rounded-lg text-center uppercase absolute -bottom-2 bg-yellow-primary text-beige-primary'>
                                      {item.tipo_plano === "anual" ? "Plano Anual" : "Plano Mensal"}
                                    </p>
                                </div>
                              </div>

                              <div className="ml-4 flex flex-1 justify-between flex-col">
                                <div className='flex flex-col gap-2'>
                                  <div className="flex justify-between text-lg font-medium text-yellow-primary">
                                    <h3>{item.nome}</h3>
                                  </div>
                                  <p className='text-brown-tertiary font-bold text-xl'>
                                    R$ {item.preco_unitario}
                                  </p>
                                </div>
                                <div className="flex flex-col text-sm">
                                  <span className="text-gray-500">Qtd: {item.quantidade} cervejas</span>
                                </div>
                              </div>

                              <div className='flex items-start'>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item.box_id)}
                                  disabled={removingItemId === item.box_id}
                                  className={`text-brown-tertiary transition-opacity ${
                                    removingItemId === item.box_id ? "opacity-40 cursor-not-allowed" : "hover:opacity-70"
                                  }`}
                                >
                                  {removingItemId === item.box_id ? (
                                    <div className="animate-spin size-5 border-2 border-brown-tertiary border-t-transparent rounded-full"></div>
                                  ) : (
                                    <X aria-hidden="true" className="size-6" />
                                  )}
                                </button>
                              </div>
                            </li>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">Seu carrinho está vazio</p>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-brown-tertiary px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-lg font-bold text-brown-tertiary">
                    <p className='uppercase'>Total</p>
                    <p>R$ {total || "0,00"}</p>
                  </div>
                  <div className="mt-6">
                    <Button
                      variant="quinary"
                      className="w-full font-bold"
                      onClick={handleFinalizarPedido}
                      disabled={loadingComprar}
                    >
                      {loadingComprar ? (
                        <span className="animate-spin rounded-full border-4 border-beige-primary border-t-transparent w-5 h-5"></span>
                      ) : (
                        "Finalizar Pedido"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
