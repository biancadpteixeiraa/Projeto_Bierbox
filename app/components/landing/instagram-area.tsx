import { PhotosCarousel } from "../ui/Photos-Carousel/photos-carousel";

export default function InstagramArea(){

    const photos = [
        {
            id:1, 
            src:"/post.png"
        },
        {
            id:2, 
            src:"/post.png"
        },
        {
            id:3, 
            src:"/post.png"
        },
        {
            id:4, 
            src:"/post.png"
        },
        {
            id:5, 
            src:"/post.png"
        },
        {
            id:6, 
            src:"/post.png"
        },
        {
            id:7, 
            src:"/post.png"
        },
        {
            id:8, 
            src:"/post.png"
        },
    ]
    
    return(
        <div className="max-w-6xl mx-auto flex flex-col items-start pl-14 pr-0 lg:px-16 pb-24 pt-24 font-primary text-brown-primary ">
            <h1 className="text-xl pb-12">
                Siga a gente no Instagram!
            </h1>
            <PhotosCarousel className="w-full">
                {photos.map((photo) => (
                <div
                    key={photo.id}
                >
                    <img
                    src={photo.src}
                    alt={`Foto ${photo.id}`}
                    className="object-cover size-56 rounded-lg lg:size-auto"
                    />
                </div>
                ))}
            </PhotosCarousel>
        </div>
    );
}