"use client";

import { Icon } from "@iconify/react";
import Button from "../../ui/button";
import { useEffect, useRef, useState } from "react";

interface UserAvatarProps {
  src?: string;
  imgLoading: boolean;
  imgError: boolean;
  setImgError: (v: boolean) => void;
  setImgLoading: (v: boolean) => void;
  onSelectImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile?: boolean;
}

export default function UserAvatar({
  src,
  imgLoading,
  imgError,
  setImgError,
  setImgLoading,
  onSelectImage,
  fileInputRef,
  onFileChange,
  isMobile = false,
}: UserAvatarProps) {
  const [cacheBuster, setCacheBuster] = useState(0);
  const prevSrcRef = useRef<string | undefined>(undefined);

  // Só gera um novo ?t= se a URL mudar
  useEffect(() => {
    if (src && src !== prevSrcRef.current) {
      setCacheBuster(Date.now());
      setImgLoading(true);
      setImgError(false);
      prevSrcRef.current = src;
    }
  }, [src, setImgError, setImgLoading]);

  const finalSrc = imgError
    ? "/post.png"
    : src
    ? `${src}?t=${cacheBuster}`
    : "/post.png"; 

  return (
    <div className="relative size-36 flex flex-col items-center">
      {imgLoading && !imgError && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full border bg-gray-100 h-36 w-36">
          <span className="animate-spin rounded-full border-4 border-brown-primary border-t-transparent size-8" />
        </div>
      )}

      <div className="h-36 w-36">
        <img
          alt="Foto do usuário"
          src={finalSrc}
          className="h-full w-full object-cover object-center rounded-full border"
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgError(true);
            setImgLoading(false);
          }}
        />
      </div>

      {isMobile ? (
        <button
          className="absolute bg-white rounded-full border border-brown-tertiary size-10 flex items-center justify-center -bottom-3 right-2"
          onClick={onSelectImage}
        >
          <Icon
            icon="fluent:camera-20-regular"
            className="text-3xl text-brown-secondary"
          />
        </button>
      ) : (
        <Button
          variant="senary"
          className="mt-3 px-6 py-3 font-medium text-xs rounded-none uppercase"
          onClick={onSelectImage}
          type="button"
        >
          Selecionar a Imagem
        </Button>
      )}

      <input
        type="file"
        accept="image/png, image/jpeg"
        ref={fileInputRef}
        onChange={onFileChange}
        hidden
      />
    </div>
  );
}
