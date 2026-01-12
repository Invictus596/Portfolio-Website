import { config } from "@/config";
import ContactCard from "@/components/contact-card";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { FaMapPin } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact",
  description: "Get in touch with me",
};

const ContactPage = () => {
  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
        <p className="text-muted-foreground mb-12 text-lg">
          I&apos;m always open to discussing new projects, creative ideas, or
          opportunities to be part of your visions.
        </p>

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
            href="https://mail.google.com/mail/?view=cm&fs=1&to=abdulkhader.dev@gmail.com"
            icon={<HiMail className="w-4 h-4" />}
          />

          <ContactCard
            title="Contact me"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=abdulkhader.dev@gmail.com&su=Contact%20from%20Portfolio"
            className="bg-primary text-white dark:text-black hover:bg-primary"
          />
        </div>

        <div className="bg-muted rounded-xl p-6 text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FaMapPin className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Location</h3>
          </div>
          <p className="text-muted-foreground">{config.social.location}</p>
        </div>

        <div className="bg-muted rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Let&apos;s work together</h2>
          <p className="text-muted-foreground mb-6">
            Whether you have a project in mind or just want to chat about
            technology, feel free to reach out. I&apos;m always interested in
            hearing about new opportunities.
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=abdulkhader.dev@gmail.com&su=Contact%20from%20Portfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-primary text-white dark:text-black hover:opacity-90 transition-opacity"
            >
              <HiMail className="w-5 h-5 mr-2" />
              Contact Me
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

