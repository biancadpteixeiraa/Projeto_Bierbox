

export default function InstagramArea(){
    
    return(
        <div className="w-full flex flex-col items-start px-52 py-14 font-primary text-brown-primary ">
            <h1 className="text-4xl pb-12">
                Siga a gente no Instagram!
            </h1>
            <div className="flex gap-6 items-center w-full">
                <img src="/post.png" alt="" className="object-cover size-64 lg-size-auto"/>
                <img src="/post.png" alt="" className="object-cover size-64 lg-size-auto"/>
                <img src="/post.png" alt="" className="object-cover size-64 lg-size-auto"/>
                <img src="/post.png" alt="" className="object-cover size-64 lg-size-auto"/>
            </div>
        </div>
    );
}