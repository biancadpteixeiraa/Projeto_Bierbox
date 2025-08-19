import Footer from "../components/common/footer";
import Header from "../components/common/header";
import BannerArea from "../components/common/banner-area";
import BenefitsArea from "../components/common/benefits-area";
import BierweArea from "../components/landing/bierweg-area";
import ExplanationArea from "../components/common/explanation-area";
import InstagramArea from "../components/landing/instagram-area";
import PlansArea from "../components/landing/plans-area";
import VideoArea from "../components/landing/video-area";


export default function Home() {
  return (
    <div className="w-full">
      <Header />
      <VideoArea />
      <ExplanationArea/>
      <BenefitsArea/>
      <PlansArea/>
      <BannerArea/>
      <InstagramArea/> 
      <BierweArea/>
      <Footer/>
    </div>
  );
}
