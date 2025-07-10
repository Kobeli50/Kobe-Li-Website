import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const PastWorkExperience: React.FC = () => {
  const projects = [
    {
      title: "TaskFlow",
      description:
        "A modern task management application built with React and TypeScript. Features real-time collaboration and beautiful UI.",
      tags: ["React", "TypeScript", "Firebase"],
    },
    {
      title: "WeatherApp Pro",
      description:
        "A comprehensive weather application with location-based forecasts, interactive maps, and weather alerts.",
      tags: ["React", "API Integration", "Maps"],
    },
    {
      title: "Portfolio CMS",
      description:
        "A content management system specifically designed for portfolio websites with drag-and-drop functionality.",
      tags: ["React", "Node.js", "MongoDB"],
    },
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Past Work & Experience
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={project.title}
                className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 animate-scale-in border-border"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.title}
                    <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4 leading-relaxed">
                    {project.description}
                  </CardDescription>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-hero hover:opacity-90 text-white">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PastWorkExperience;
