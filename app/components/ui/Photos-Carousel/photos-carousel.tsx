'use client'
import styles from './styles.module.css'
import useEmblaCarousel from 'embla-carousel-react';
import { ReactNode } from 'react';
import { cn } from "@/app/lib/utils";

type PhotosCarouselProps = {
  children: ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export default function PhotosCarousel({
  children,
  className,
  ...props
}: PhotosCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' })

  return (
    <div {...props} 
    className={cn(styles.embla, 'relative w-full', className)}
    role="region" 
    aria-label="Carrossel de Postagens do Instagram">
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container} role="feed">
          {Array.isArray(children)
            ? children.map((child, index) => (
                <div key={index} className={styles.embla__slide} role="listitem">
                  {child}
                </div>
              ))
            : (
              <div className={styles.embla__slide}>
                {children}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
