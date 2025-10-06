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

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const data = await getInstagramPhotos();

        if (data.photos) {
          // adiciona mocks extras junto com os posts reais
          const mocks: InstagramPhoto[] = [
            {
              id: "mock1",
              media_url: "/post.png",
              permalink: "#",
              thumbnail_url: "/post.png",
              media_type: "IMAGE",
            },
            {
              id: "mock2",
              media_url: "/post.png",
              permalink: "#",
              thumbnail_url: "/post.png",
              media_type: "VIDEO",
            },
            {
              id: "mock3",
              media_url: "/post.png",
              permalink: "#",
              thumbnail_url: "/post.png",
              media_type: "VIDEO",
            },
            {
              id: "mock4",
              media_url: "/post.png",
              permalink: "#",
              thumbnail_url: "/post.png",
              media_type: "VIDEO",
            },
            {
              id: "mock5",
              media_url: "/post.png",
              permalink: "#",
              thumbnail_url: "/post.png",
              media_type: "VIDEO",
            },
          ];

          setPhotos([...data.photos, ...mocks]);
        }
      } catch (err) {
        console.error("Erro ao carregar fotos do Instagram:", err);
      } finally {
        //setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-start pl-14 pr-0 lg:px-16 pb-24 pt-24 font-primary text-brown-primary">
      <h1 className="text-xl pb-12 lg:pr-0 pr-14 lg:text-start text-center">Siga a gente no Instagram!</h1>

      {loading ? (
        <InstagramPhotosSkeleton/>
      ) : (
        <PhotosCarousel className="w-full">
          {photos.map((photo) => (
            <div key={photo.id}>
              <a
                href={photo.permalink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {photo.media_type === "IMAGE" && (
                  <img
                    src={photo.media_url}
                    alt={`Foto ${photo.id}`}
                    className="object-cover size-56 rounded-lg lg:size-96"
                  />
                )}
                {photo.media_type === "VIDEO" && (
                  <img
                    src={photo.thumbnail_url}
                    alt={`Vídeo ${photo.id}`}
                    className="object-cover size-56 rounded-lg lg:size-96"
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
