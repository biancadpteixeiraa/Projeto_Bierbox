"use client";
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type BoxGalleryProps = {
  images: string[];
};

export function BoxGallery({ images }: BoxGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return <p className="text-brown-tertiary">Sem imagens disponíveis</p>;
  }

  return (
    <div className="gap-0 md:gap-3 flex md:p-0 px-5 md:h-[530px] h-80 w-full md:max-w-[500px]">
      {/* miniaturas */}
      <div className="flex flex-col gap-3">
        {images.map((img, index) => (
          <div key={index}>
            <img
              onClick={() => setActiveIndex(index)}
              src={img}
              className={`size-24 cursor-pointer rounded-lg object-cover object-center hidden md:block ${
                index === activeIndex ? "ring-2 ring-yellow-primary" : ""
              }`}
              alt={`gallery-thumb-${index}`}
            />
          </div>
        ))}
      </div>

      {/* imagem grande com setas */}
      <div className="relative w-full">
        <img
          className="w-full md:max-w-[600px] h-full rounded-lg object-cover object-center"
          src={images[activeIndex]}
          alt={`gallery-main-${activeIndex}`}
        />

        {/* Botão esquerda */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
        >
          <ArrowLeft size={24}/>
        </button>

        {/* Botão direita */}
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
        >
          <ArrowRight size={24}/>
        </button>
      </div>
    </div>
  );
}
