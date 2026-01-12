"use client";

import { motion } from "motion/react";
import { config } from "@/config";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiMongodb,
  SiExpress,
  SiGit,
  SiAmazon,
  SiDocker,
  SiFramer,
  SiPython,
  SiOpenjdk,
  SiHtml5,
  SiMysql,
  SiC,
  SiLinux,
  SiPandas,
  SiNumpy,
  SiPlotly,
  SiScikitlearn,
  SiTensorflow,
  SiBlockchaindotcom,
  SiCyberdefenders,
} from "react-icons/si";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  react: SiReact,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  typescript: SiTypescript,
  javascript: SiJavascript,
  tailwind: SiTailwindcss,
  mongodb: SiMongodb,
  express: SiExpress,
  git: SiGit,
  aws: SiAmazon,
  docker: SiDocker,
  framer: SiFramer,
  python: SiPython,
  java: SiOpenjdk,
  html: SiHtml5,
  mysql: SiMysql,
  c: SiC,
  linux: SiLinux,
  pandas: SiPandas,
  numpy: SiNumpy,
  matplotlib: SiPlotly,
  scikitlearn: SiScikitlearn,
  ml: SiTensorflow,
  blockchain: SiBlockchaindotcom,
  cybersecurity: SiCyberdefenders,
  datascience: SiPython,
  webdev: SiReact,
};

const SkillsPage = () => {
  const skills = config.skills;

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Skills & Technologies</h1>
        <p className="text-muted-foreground mb-12 text-lg">
          Technologies and tools I work with
        </p>

        {/* Skills Grid - Like project images design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => {
            const IconComponent = iconMap[skill.icon.toLowerCase()] || SiReact;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-xl bg-muted hover:bg-muted-foreground/10 transition-all duration-300"
              >
                {/* Icon Container - Like image container */}
                <div className="relative aspect-square overflow-hidden bg-background dark:bg-gray-800 flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                    <IconComponent className="w-full h-full text-foreground dark:text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Skill Name - Like project title */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-center">{skill.name}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;

