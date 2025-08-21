'use client'
import useEmblaCarousel from 'embla-carousel-react'
import { ReactNode, useCallback, useEffect } from 'react'
import { cn } from "@/app/lib/utils";

type PlansCarouselProps = {
  children: ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export function PlansCarousel({ children, className, ...props }: PlansCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()) // Access API
    }
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div
      {...props}
      className={cn("embla relative h-96", className)}
    >
      <div className="embla__viewport h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {Array.isArray(children)
            ? children.map((child, index) => (
                <div
                  key={index}
                  className="embla__slide flex h-full items-center justify-center"
                >
                  {child}
                </div>
              ))
            : (
              <div className="embla__slide flex h-full items-center justify-center">
                {children}
              </div>
            )}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white"
      >
        ◀
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white"
      >
        ▶
      </button>
    </div>
  )
}
