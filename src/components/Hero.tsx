import heroCharacter from "@/assets/cow.png";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-none">
              Hello, my
              <br />
              name's{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Kobe Li
              </span>
              .<br />
              I'm a VC Intern
              <br />
              @Lockstep Venutere
            </h1>

            <div className="flex items-center space-x-2 text-lg text-muted-foreground">
              <span>Think</span>
              <span className="text-2xl">🧠</span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative animate-float">
              <img
                src={heroCharacter}
                alt="3D Character Illustration"
                className="w-80 h-80 object-contain"
              />
              <div className="absolute -inset-4 bg-gradient-accent opacity-20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
