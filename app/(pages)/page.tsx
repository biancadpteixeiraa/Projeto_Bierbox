import Header from "../components/common/header";
import BenefitsArea from "../components/landing/benefits-area";
import ExplanationArea from "../components/landing/explanation-area";
import VideoArea from "../components/landing/video-area";
import Button from "../components/ui/button";

export default function Home() {
  return (
    <div className="w-full">
      <Header />
      <VideoArea />
      <ExplanationArea/>
      <BenefitsArea/>
      <div className="h-48">

      </div>
    </div>
  );
}
