'use client'
import './plans-carousel.css';
import useEmblaCarousel from 'embla-carousel-react'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { cn } from "@/app/lib/utils";
import { ArrowLeft, ArrowRight } from 'lucide-react';

type PlansCarouselProps = {
  children: ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export function PlansCarousel({ children, className, ...props }: PlansCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    breakpoints: {
      '(min-width: 768px)': { 
        slidesToScroll: 1,
        align: 'center'
      }
    }
  })

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div
      {...props}
      className={cn("embla relative w-full", className)}
    >
      <div className="embla__viewport w-full" ref={emblaRef}>
        <div className="embla__container">
          {Array.isArray(children)
            ? children.map((child, index) => (
                <div
                  key={index}
                  className="embla__slide"
                >
                  {child}
                </div>
              ))
            : (
              <div className="embla__slide">
                {children}
              </div>
            )}
        </div>
      </div>

      {/* Botões de navegação - visíveis apenas em desktop */}
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className="hidden lg:flex absolute top-1/2 left-4 -translate-y-1/2 bg-yellow-primary/20 hover:bg-yellow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-3 transition-all duration-200 z-10 items-center justify-center"
        aria-label="Slide anterior"
      >
        <ArrowLeft className='text-yellow-primary size-5'/>
      </button>
      
      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className="hidden lg:flex absolute top-1/2 right-4 -translate-y-1/2 bg-yellow-primary/20 hover:bg-yellow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-3 transition-all duration-200 z-10 items-center justify-center"
        aria-label="Próximo slide"
      >
        <ArrowRight className='text-yellow-primary size-5'/>
      </button>

      {/* Indicadores de slide - visíveis apenas em mobile */}
      <div className="flex lg:hidden justify-center mt-6 gap-2">
        {Array.isArray(children) && children.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="w-2 h-2 rounded-full bg-yellow-primary/30 hover:bg-yellow-primary/60 transition-colors"
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}