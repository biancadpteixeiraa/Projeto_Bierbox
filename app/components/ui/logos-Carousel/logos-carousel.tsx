'use client'
import styles from './styles.module.css'
import React, { useEffect, useState, useCallback } from 'react' // Importamos estados e callbacks
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import Image from 'next/image'
import { Play, Pause } from 'lucide-react' // Ícones para o botão escondido

type LogoSlide = {
  logo: string
  src: string
  insta: string
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

  const [isPlaying, setIsPlaying] = useState(true) 
  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions, [
   AutoScroll(
    { 
      playOnInit: true,
      speed: 0.5,
      stopOnMouseEnter: true,
    }
  ),
  ])

  const toggleAutoscroll = useCallback(() => {
    if (!emblaApi) return

    const autoScroll = emblaApi.plugins()?.autoScroll
    if (!autoScroll) return

    if (autoScroll.isPlaying()) {
       autoScroll.stop()
       setIsPlaying(false)
    } else {
       autoScroll.play()
       setIsPlaying(true)
    }
  }, [emblaApi])


  useEffect(() => {
    if (!emblaApi) return

    const autoScroll = emblaApi.plugins()?.autoScroll
    if (!autoScroll) return

    const viewport = emblaApi.containerNode().parentElement

    const handleMouseLeave = () => {
      // Só reinicia se estava tocando antes
      if (isPlaying && !autoScroll.isPlaying()) {
        autoScroll.play()
      }
    }

    // Retoma quando o mouse sai
    viewport?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      viewport?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [emblaApi, isPlaying])

  return (
   <div className={`${styles.embla} w-full relative`}  role="presentation">

    <button
        onClick={toggleAutoscroll}
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

    <div className={`${styles.embla__viewport} w-full`} ref={emblaRef}>
     <div className={styles.embla__container}>
       {slides.map((item, index) => (
        <div className={styles.embla__slide} key={index} role="listitem">
         <div className={`${styles.embla__slide__number} flex items-center justify-center`}>
          <a href={item.insta} className="apparence-none" target="_blank" rel="noopener noreferrer">
            <Image
              src={item.src}
              alt={item.logo}
              width={200}
              height={200}
              className="object-contain max-h-48 rounded-3xl"
              />
          </a>
         </div>
        </div>
       ))}
     </div>
    </div>
   </div>
  )
}