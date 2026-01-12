/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  demo: string;
}

const StaticProjectsSection = () => {
  const staticProjects: Project[] = [
    {
      id: 1,
      title: "ZK-Anti-Cheat",
      description: "The world's first FPS with non-invasive ZK anti-cheat on Starknet. Replaces kernel-level spyware with on-chain physics verification to validate 'Proof of Shot' logic.",
      image: "/projects/blockchain.jpg",
      technologies: ["Starknet", "Cairo", "Blockchain"],
      github: "https://github.com/invictus596/ZK-Anti-Cheat",
      demo: "#",
    },
    {
      id: 2,
      title: "Vendor-Data-Analysis",
      description: "A comprehensive data analysis project utilizing Jupyter Notebooks to evaluate vendor performance and visualize supply chain trends.",
      image: "/projects/dataanalysis.jpg",
      technologies: ["Jupyter Notebook", "Python", "Data Science"],
      github: "https://github.com/invictus596/vendor-data-analysis",
      demo: "#",
    },
    {
      id: 3,
      title: "Kindle-Browser-Monitor",
      description: "A Python utility to render real-time system monitoring or dashboards optimized for Kindle e-ink displays.",
      image: "/projects/kindle.jpg",
      technologies: ["Python", "Automation", "IoT"],
      github: "https://github.com/Invictus596/Kindle-Browser-Monitor",
      demo: "#",
    },
    {
      id: 4,
      title: "Minimal-QR-Code-Generator-Scanner",
      description: "A lightweight, dual-purpose web tool built with TypeScript for generating and scanning QR codes instantly.",
      image: "/projects/qrcode.jpg",
      technologies: ["TypeScript", "Web Tools"],
      github: "https://github.com/invictus596/Minimal-QR-Code-Generator-Scanner",
      demo: "#",
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h1>
        <p className="text-muted-foreground mb-12 text-lg">
          A selection of my key projects showcasing different technologies and domains
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {staticProjects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-xl bg-muted hover:bg-muted-foreground/10 transition-all duration-300 border"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized // Required for external images from Unsplash
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-background rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Link
                    href={project.github}
                    target="_blank"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <FaGithub className="w-4 h-4" />
                    Code
                  </Link>
                  {project.demo !== "#" && (
                    <Link
                      href={project.demo}
                      target="_blank"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      Demo
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaticProjectsSection;