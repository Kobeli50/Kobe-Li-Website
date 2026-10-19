import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    name: "OpenLedger",
    description: "Split your expenses",
    href: "https://tryopenledger.com",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Projects</h2>

          <div className="flex flex-wrap justify-center gap-6">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-80 rounded-lg border border-border p-6 transition hover:border-accent hover:shadow-medium"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold">{project.name}</h3>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:text-accent" />
                </div>
                <p className="mt-2 text-muted-foreground">{project.description}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {new URL(project.href).hostname}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
