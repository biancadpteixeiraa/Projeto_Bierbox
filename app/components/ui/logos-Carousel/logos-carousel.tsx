'use client'
import './logos-carousel.css'
import React, { useEffect } from 'react' // Importamos o useEffect
import { EmblaOptionsType } from 'embla-carousel'
// IMPORTANTE: Você precisa do useCallback/useState se for usar o isPlaying novamente,
// mas para o objetivo de re-iniciar, só o useEffect é suficiente.
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import Image from 'next/image'

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

 // 1. Precisamos do emblaApi novamente para acessar o plugin e os eventos
 const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions, [
  AutoScroll({ playOnInit: true }),
 ])

 // 2. Novo useEffect para lidar com o reinício do Autoscroll
 useEffect(() => {
   if (!emblaApi) return

   const autoScroll = emblaApi.plugins()?.autoScroll
   if (!autoScroll) return

   // Esta função será chamada toda vez que o carrossel parar de se mover (após um deslize do usuário)
   const restartAutoscroll = () => {
     // Se o Autoscroll não estiver tocando (porque o usuário o parou), reinicie-o
     if (!autoScroll.isPlaying()) {
       autoScroll.play()
     }
   }

   // Associa a função ao evento 'settle', que dispara quando o Embla para de rolar
   emblaApi.on('settle', restartAutoscroll)

   // Cleanup: remove o listener quando o componente for desmontado
   return () => {
     emblaApi.off('settle', restartAutoscroll)
   }
 }, [emblaApi]) // Dependência no emblaApi

 return (
  <div className="embla w-full">
   <div className="embla__viewport w-full" ref={emblaRef}>
    <div className="embla__container">
     {slides.map((item, index) => (
      <div className="embla__slide" key={index}>
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