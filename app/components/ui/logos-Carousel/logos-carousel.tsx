'use client'
import './logos-carousel.css'
import React, { useEffect, useState, useCallback } from 'react' // Importamos estados e callbacks
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import Image from 'next/image'
import { Play, Pause } from 'lucide-react' // Ícones para o botão escondido

type LogoSlide = {
  logo: string
  src: string
}

type PropType = {
  slides: LogoSlide[]
  options?: EmblaOptionsType
}

export default function LogosCarousel({ slides, options }: PropType) {
  const carouselOptions: EmblaOptionsType = {
   loop: true,
   ...options,
  }

  const [isPlaying, setIsPlaying] = useState(true) // NOVO: Estado para rastrear o play/pause
  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions, [
   AutoScroll({ playOnInit: true }),
  ])

  // NOVO: Função para pausar/reiniciar o Autoscroll
  const toggleAutoscroll = useCallback(() => {
    if (!emblaApi) return

    const autoScroll = emblaApi.plugins()?.autoScroll
    if (!autoScroll) return

    if (autoScroll.isPlaying()) {
       autoScroll.stop()
       setIsPlaying(false) // Atualiza o estado
    } else {
       autoScroll.play()
       setIsPlaying(true) // Atualiza o estado
    }
  }, [emblaApi])


  useEffect(() => {
    if (!emblaApi) return

    const autoScroll = emblaApi.plugins()?.autoScroll
    if (!autoScroll) return

    // Garante que o Autoscroll reinicie APENAS se o estado isPlaying for true
    const restartAutoscroll = () => {
       if (!autoScroll.isPlaying() && isPlaying) {
         autoScroll.play()
       }
    }

    // Associa a função ao evento 'settle'
    emblaApi.on('settle', restartAutoscroll)

    return () => {
       emblaApi.off('settle', restartAutoscroll)
    }
  }, [emblaApi, isPlaying]) // Adicionamos isPlaying como dependência

  return (
   <div className="embla w-full relative" role="presentation">
    
    {/* NOVO: Botão de Pause/Play Escondido (sr-only) */}
    <button
        onClick={toggleAutoscroll}
        // As classes 'sr-only' tornam o botão invisível, mas focável
        // O tabindex e o foco por teclado o tornam o primeiro elemento a ser focado na área.
        className="sr-only focus:not-sr-only focus:p-2 focus:bg-gray-100 focus:text-brown-tertiary focus:border border-brown-tertiary"
        aria-label={isPlaying ? "Pausar rolagem automática das cervejarias" : "Continuar rolagem automática das cervejarias"}
    >
        {isPlaying ? (
            <>
                <Pause className="size-5 inline-block" aria-hidden="true" /> 
                <span>Pausar</span>
            </>
        ) : (
            <>
                <Play className="size-5 inline-block" aria-hidden="true" />
                <span>Continuar</span>
            </>
        )}
    </button>

    <div className="embla__viewport w-full" ref={emblaRef}>
     <div className="embla__container">
       {slides.map((item, index) => (
        <div className="embla__slide" key={index} role="listitem">
         <div className="embla__slide__number flex items-center justify-center">
          <Image
            src={item.src}
            alt={item.logo}
            width={200}
            height={200}
            className="object-contain max-h-48 rounded-3xl"
          />
         </div>
        </div>
       ))}
     </div>
    </div>
   </div>
  )
}