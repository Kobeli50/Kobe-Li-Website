const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>
          
          <div className="prose prose-lg max-w-none text-center">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              I'm 22, currently a software engineer passionate about creating amazing digital experiences. 
              I've led many software teams to success and been a pivotal part of many early stage startups.
            </p>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              I got my first Software Developer job at 19 and have been working in the industry 
              ever since, constantly learning and pushing the boundaries of what's possible with code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;