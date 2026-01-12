"use client";

import Carousel from "@/components/photo-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  demo: string;
}

export const SliderView = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define the static projects for the slider
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
      }
    ];

    // Simulate loading delay for better UX
    setTimeout(() => {
      setProjects(staticProjects);
      setLoading(false);
    }, 500);
  }, []);

  if (loading || projects.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-xl">
        {loading ? (
          <div className="flex flex-col items-center">
            <Skeleton className="w-12 h-12 rounded-full mb-4" />
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : (
          <p className="text-gray-500">No projects to display</p>
        )}
      </div>
    );
  }

  return (
    <Carousel
      className="absolute top-0 left-0 w-full h-full rounded-xl"
      containerClassName="h-full"
      autoplayDelay={5000}
    >
      {projects.map((project, index) => {
        const shouldPreload = index < 1;

        return (
          <div key={project.id} className="flex-[0_0_100%] h-full relative group">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="75vw"
              priority={shouldPreload}
              className="w-full h-full object-cover rounded-xl"
              unoptimized // Required for external images from Unsplash
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="text-sm text-white/90 line-clamp-2">{project.description}</p>
            </div>
          </div>
        );
      })}
    </Carousel>
  );
};

export const SliderViewLoadingStatus = () => {
  return (
    <div className="w-full lg:w-1/2 h-[70vh] lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3 rounded-xl">
      <Skeleton className="w-full h-full" />
    </div>
  );
};
