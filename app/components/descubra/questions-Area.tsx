import Quiz from "../forms/quiz";


export default function QuestionsArea(){

    return(
        <div className="max-w-5xl mx-auto py-14 px-10">
            <h1 className="font-primary text-brown-tertiary uppercase text-lg">AINDA NÃO SABE QUAL O SEU ESTILO?</h1>
            <p className="uppercase font-secondary font-semibold text-sm text-brown-tertiary pt-6">rESPONDA Ao QUESTionário E descubra qual a box ideal para você!</p>
            <div className="py-14">
                <Quiz/>
            </div>
        </div>
    )
}