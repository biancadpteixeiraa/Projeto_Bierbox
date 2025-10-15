import PhotosCarousel from "../ui/Photos-Carousel/photos-carousel";

export default function PhotosBierweg(){

    const photos = [
        {
            id:1, 
            src:"/bierweg/IMG_01.jpg"
        },
        {
            id:2, 
            src:"/bierweg/IMG_02.jpg"
        },
        {
            id:3, 
            src:"/bierweg/IMG_03.jpg"
        },
        {
            id:4, 
            src:"/bierweg/IMG_04.jpg"
        },
        {
            id:5, 
            src:"/bierweg/IMG_05.jpg"
        },
        {
            id:6, 
            src:"/bierweg/IMG_06.jpg"
        },
        {
            id:7, 
            src:"/bierweg/IMG_07.jpg"
        },
        {
            id:8, 
            src:"/bierweg/IMG_08.jpg"
        },
        {
            id:9, 
            src:"/bierweg/IMG_09.jpg"
        },
        {
            id:10, 
            src:"/bierweg/IMG_10.jpg"
        },
    ]
    
    return(
        <div className="max-w-6xl mx-auto flex flex-col items-start pl-6 pr-0 lg:px-14 pt-20 pb-24 font-primary text-brown-primary ">
            <h1 className="text-2xl pb-12 pr-6 lg:pr-0 text-center md:text-start">
                Acompanhe a Rota da Cerveja!
            </h1>
            <PhotosCarousel className="w-full">
                {photos.map((photo) => (
                <div
                    key={photo.id}
                >
                    <a href="https://www.instagram.com/bierweg/" className="apparence-none" target="_blank" rel="noopener noreferrer">
                        <img
                        src={photo.src}
                        alt={`Foto ${photo.id}`}
                        className="object-cover size-64 rounded-lg lg:size-64"
                        />
                    </a>
                </div>
                ))}
            </PhotosCarousel>
        </div>
    );
}