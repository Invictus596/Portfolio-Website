import StaticProjectsSection from "@/modules/home/ui/components/static-projects-section";

export const metadata = {
  title: "Projects",
  description: "My portfolio projects",
};

const ProjectsPage = () => {
  return (
    <div>
      <StaticProjectsSection />
    </div>
  );
};

export default ProjectsPage;

