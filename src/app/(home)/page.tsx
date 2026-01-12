import ProfileCard from "@/modules/home/ui/components/profile-card";
import { SkillsShowcase } from "@/modules/home/ui/components/skills-showcase";
import { SliderView } from "@/modules/home/ui/views/slider-view";
import Footer from "@/components/footer";

const page = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* LEFT CONTENT - Fixed - Project Slider */}
      <div className="w-full lg:w-1/2 h-[70vh] lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3 rounded-xl">
        <SliderView />
      </div>
      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />
      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full mt-3 lg:mt-0 lg:w-1/2 space-y-3 pb-3">
        {/* PROFILE CARD  */}
        <ProfileCard />

        {/* SKILLS SHOWCASE  */}
        <SkillsShowcase />

        <Footer />
      </div>
    </div>
  );
};

export default page;
