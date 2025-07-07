const Skills = () => {
  const skills = [
    "HTML",
    "TypeScript",
    "React",
    "Git",
    "Express",
    "GraphQL",
    "Firebase",
    "MongoDB",
    "SQL",
    "Prisma",
    "Dart",
    "Flutter"
  ];

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">My Skills</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <div
                key={skill}
                className="group p-6 bg-card rounded-xl border border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full group-hover:bg-purple transition-colors"></span>
                  <span className="font-medium text-sm">{skill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;