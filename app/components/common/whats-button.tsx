"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/app/lib/utils";


const WHATSAPP_NUMBER = "5511999999999"; 
const MESSAGE_TEXT = "Olá, gostaria de saber mais sobre a BierBox!";

const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE_TEXT)}`;


export default function WhatsappButton() {
  return (
    <a 
      href={whatsappLink} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      
      className={cn(
        "fixed bottom-6 right-6 z-50", // Posição Fixa
        "bg-green-500 hover:bg-green-600 transition-colors duration-300", // Cor de fundo
        "text-white p-1 rounded-full shadow-lg", // Padding e formato circular
        "cursor-pointer flex items-center justify-center", // Estilo do conteúdo
        "size-14" // Tamanho do botão
      )}
    >
      <Icon icon="logos:whatsapp-icon" className="text-[3px]" aria-label="Fale conosco pelo WhatsApp!"/>
    </a>
  );
}
