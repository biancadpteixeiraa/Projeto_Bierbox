

export default function InstagramArea(){
    
    return(
        <div className="w-full flex flex-col items-start px-52 py-14 font-primary text-brown-primary ">
            <h1 className="text-4xl pb-12">
                Siga a gente no Instagram!
            </h1>
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between w-full">
                <img src="/post.png" alt="" className="object-cover size-auto"/>
                <img src="/post.png" alt="" className="object-cover size-auto"/>
                <img src="/post.png" alt="" className="object-cover size-auto"/>
                <img src="/post.png" alt="" className="object-cover size-auto"/>
            </div>
        </div>
    );
}