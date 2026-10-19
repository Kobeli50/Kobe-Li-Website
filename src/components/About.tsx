const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>

          <div className="prose prose-lg max-w-none text-center">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              I'm 20, currently a college student at Baruch College studying
              Finance with a minor in Philosophy. I like learning, investing,
              and connecting with cool people.
            </p>

            <p className="text-xl text-muted-foreground leading-relaxed">
              I like{" "}
              <a
                href="/gallery"
                className="text-foreground underline decoration-purple-light underline-offset-4 transition-colors hover:decoration-purple"
              >
                photography
              </a>{" "}
              and reading. I'll read about pretty much anything, so feel free
              to send recs. I also enjoy playing video games and poker,
              watching anime, and skiing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
