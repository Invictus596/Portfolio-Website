import { config } from "@/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { FaMapPin } from "react-icons/fa";
import ContactCard from "@/components/contact-card";

export const metadata = {
  title: "About",
  description: "About me",
};

const AboutPage = () => {
  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
          <Avatar className="size-32 md:size-40">
            <AvatarImage src={config.developer.avatar} alt="Avatar" />
            <AvatarFallback className="text-4xl">
              {config.developer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {config.developer.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              {config.developer.title}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {config.developer.bio}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <ContactCard
            title="GitHub"
            href={`https://github.com/${config.social.github}`}
            icon={<FaGithub className="w-4 h-4" />}
          />

          <ContactCard
            title="LinkedIn"
            href="https://www.linkedin.com/in/invictus596/"
            icon={<FaLinkedinIn className="w-4 h-4" />}
          />

          <ContactCard
            title="Email"
            href={`mailto:${config.social.email}`}
            icon={<HiMail className="w-4 h-4" />}
          />

          <div className="p-6 bg-muted rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <FaMapPin className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Location</h3>
            </div>
            <p className="text-muted-foreground">{config.social.location}</p>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            I&apos;m a passionate full-stack developer who loves building
            digital experiences that make a difference. My approach combines
            clean code, thoughtful design, and user-centered thinking.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            When I&apos;m not coding, I enjoy exploring new technologies,
            contributing to open-source projects, and sharing knowledge with the
            developer community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
