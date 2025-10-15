"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/app/lib/utils";


const WHATSAPP_NUMBER = "5542998160345"; 
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
        "fixed bottom-6 right-6 z-30",
        "bg-green-500 hover:bg-green-600 transition-colors duration-300",
        "text-white p-1 rounded-full shadow-lg",
        "cursor-pointer flex items-center justify-center",
        "size-14"
      )}
    >
      <Icon icon="logos:whatsapp-icon" className="text-[36px]" aria-label="Fale conosco pelo WhatsApp!"/>
    </a>
  );
}
