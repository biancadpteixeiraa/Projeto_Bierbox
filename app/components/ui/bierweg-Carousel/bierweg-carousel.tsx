"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from 'embla-carousel'
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import styles from "./styles.module.css";

type Slide = {
  id: number;
  src: string;
};

type PropType = {
  slides: Slide[];
  options?: EmblaOptionsType;
};

export default function BierwegCarousel({ slides, options }: PropType) {
    const carouselOptions: EmblaOptionsType = {
    loop: true,
    ...options,
    }
    const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions);

    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
    const scrollNext = () => emblaApi && emblaApi.scrollNext();

    return (
        <section className={`${styles.embla} w-full relative`}>
            <div className={`${styles.embla__viewport} w-full`} ref={emblaRef}>
            <div className={`${styles.embla__container} w-full`}>
                {slides.map((slide) => (
                <div className={`${styles.embla__slide} w-full`}  key={slide.id}>
                    <Image
                    src={slide.src}
                    alt={`Banner ${slide.id}`}
                    width={1920}
                    height={520}
                    className="w-full h-64 sm:h-[520px] object-fill"
                    priority
                    />
                </div>
                ))}
            </div>
            </div>

            <div className="absolute inset-0 flex justify-between items-center px-4">
            <button
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
            >
            <ArrowLeft size={24}/>
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
            >
            <ArrowRight size={24}/>
            </button>
            </div>
        </section>
    );
}
