'use client'
import './photos-carousel.css';
import useEmblaCarousel from 'embla-carousel-react';
import { ReactNode } from 'react';
import { cn } from "@/app/lib/utils";

type PhotosCarouselProps = {
  children: ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export function PhotosCarousel({
  children,
  className,
  ...props
}: PhotosCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' })

  return (
    <div {...props} className={cn("embla relative w-full", className)}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {Array.isArray(children)
            ? children.map((child, index) => (
                <div key={index} className="embla__slide">
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
    </div>
  )
}
