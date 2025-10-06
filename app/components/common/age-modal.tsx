"use client";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import Button from '../ui/button';

const LOCAL_STORAGE_KEY = 'age_confirmed_v1'; 

export default function AgeConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isConfirmed = sessionStorage.getItem(LOCAL_STORAGE_KEY);
      
      if (!isConfirmed) {
        setIsOpen(true);
      }
    }
  }, []); 

  function handleConfirm() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    }
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={() => {}}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                
                <DialogTitle
                  as="h3"
                  className="text-lg font-bold leading-6 text-brown-primary"
                >
                  Confirmação de Idade Necessária
                </DialogTitle>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-700">
                    Ao acessar este site, você declara ter 18 anos de idade ou mais!
                  </p>
                </div>

                <div className="mt-8 flex flex-col space-y-2">
                  <Button
                  onClick={handleConfirm}
                  type='button'
                  className='font-medium'>
                    Confirmo ter 18 anos ou mais
                  </Button>
                  <a 
                    href="https://www.google.com" // Link de redirecionamento para quem não confirma
                    className="text-xs text-gray-500 hover:text-gray-700 hover:underline text-center p-1"
                  >
                    Não tenho 18 anos / Sair do site
                  </a>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}