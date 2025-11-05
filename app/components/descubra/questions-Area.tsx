import Quiz from "../forms/quiz";


export default function QuestionsArea(){

    return(
        <div className="max-w-7xl mx-auto py-14 md:px-16 px-6 flex">
            <div className="md:w-7/12 w-full">
                <h1 className="font-primary text-brown-tertiary uppercase text-sm sm:text-base">AINDA NÃO SABE QUAL O SEU ESTILO?</h1>
                <p className="uppercase font-secondary font-semibold text-[11px] sm:text-xs text-brown-tertiary pt-4">rESPONDA Ao QUESTionário E descubra qual a box ideal para você!</p>
                <div className="py-10 sm:py-14">
                    <Quiz/>
                </div>
            </div>
            <div className="w-5/12 hidden md:flex items-center justify-center">
                <img src="/descubra.png" alt="" />
            </div>
        </div>
    )
}