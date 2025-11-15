'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    isLoading?: boolean;
  }
  
  export default function Modal({ isOpen, onClose, onConfirm, title, description, isLoading }: ModalProps) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
  
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-[420px] sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-8 sm:pb-4">
                <DialogTitle as="h3" className="sm:text-xl text-lg font-semibold text-brown-tertiary text-center pb-6">
                  {title}
                </DialogTitle>
                <p className="mt-2 sm:text-base text-sm text-gray-700 pb-2">
                  • {description}
                </p>
                <p className="mt-2 sm:text-base text-sm text-gray-700 pb-4">
                  • Uma vez excluído a ação não poderá ser desfeita.
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:justify-center sm:px-6 sm:pb-6 gap-3">
                <button
                  onClick={onConfirm}
                  className="cursor-pointer inline-flex w-full justify-center rounded-md px-6 py-2 text-base font-semibold text-beige-primary bg-brown-primary shadow-sm hover:bg-brown-primary/85 sm:w-auto sm:ml-18"
                >
                  { isLoading ? (
                    <span className="mx-[28px] my-[2px] animate-spin rounded-full border-4 border-beige-primary border-t-transparent size-4"></span>
                  ) : (
                    "Confirmar"
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white px-6 py-2 text-base font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    )
  }
