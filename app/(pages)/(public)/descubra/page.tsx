import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import QuestionsArea from "@/app/components/descubra/questions-Area";

export default function Page(){

    return(
        <div>
            <Header/>
            <QuestionsArea/>
            <Footer/>
        </div>
    );
}