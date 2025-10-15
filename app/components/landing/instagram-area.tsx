"use client";

import { useEffect, useState } from "react";
import PhotosCarousel from "../ui/Photos-Carousel/photos-carousel";
import { getInstagramPhotos } from "@/app/services/instagram";
import { InstagramPhotosSkeleton } from "../ui/skeletons";

interface InstagramPhoto {
  id: string;
  media_url: string;
  permalink: string;
  thumbnail_url: string;
  media_type: "IMAGE" | "VIDEO";
}

export default function InstagramArea() {
  const [photos, setPhotos] = useState<InstagramPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const data = await getInstagramPhotos();

        if (data.photos) {
          setPhotos([...data.photos]);
        }
        setError(false);
      } catch (err) {
        console.error("Erro ao carregar fotos do Instagram:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-start pl-14 pr-0 md:px-16 pb-24 pt-24 font-primary text-brown-primary">
      <h1 className="text-xl pb-12 lg:pr-0 pr-14 lg:text-start text-center">Siga a gente no Instagram!</h1> 

      {loading || error ? (
        <InstagramPhotosSkeleton/>
      ) : (
        <PhotosCarousel className="w-full">
          {photos.map((photo) => (
            <div key={photo.id}>
              <a
                href={photo.permalink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver postagem original no Instagram (ID: ${photo.id})`} 
              >
                {photo.media_type === "IMAGE" && (
                  <img
                    src={photo.media_url}
                    alt={`Postagem de imagem da BierBox no Instagram`}
                    className="object-cover size-56 rounded-lg !lg:size-auto"
                  />
                )}
                {photo.media_type === "VIDEO" && (
                  <img
                    src={photo.thumbnail_url}
                    alt={`Postagem de vídeo da BierBox no Instagram`}
                    className="object-cover size-56 rounded-lg !lg:size-auto"
                  />
                )}
              </a>
            </div>
          ))}
        </PhotosCarousel>
      )}
    </div>
  );
}
