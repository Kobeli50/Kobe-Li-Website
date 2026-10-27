const About = () => {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="page-width about-layout">
        <div className="about-heading">
          <h2 id="about-title">About Me<span aria-hidden="true">.</span></h2>
        </div>
        <div className="about-copy">
            <p className="about-lead">
              I'm 20, currently a college student at Baruch College studying
              <strong> Finance</strong> with a minor in <strong>Philosophy</strong>. I like learning, investing,
              and connecting with cool people. Still working and learning toward publishing more stuff.
            </p>

            <p>
              I like{" "}
              <a
                href="/gallery"
                className="underline underline-offset-4"
              >
                photography
              </a>{" "}
              and reading. I'll read about pretty much anything, so feel free
              to send recs.
            </p>
            <p>I also enjoy hiking, skiing, playing video games, poker, and watching shows and movies.</p>
        </div>
      </div>
    </section>
  );
};

export default About;
