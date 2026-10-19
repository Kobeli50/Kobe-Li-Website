import heroCharacter from "@/assets/cow.png";

// Pre-fills the contact form's subject so deal emails are easy to spot.
const prefillDealSubject = () => {
  const subject = document.getElementById("subject") as HTMLInputElement | null;
  if (subject && !subject.value) subject.value = "Deal: ";
};

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <a
              href="#contact"
              onClick={prefillDealSubject}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-turquoise opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-turquoise"></span>
              </span>
              Looking for private deals →
            </a>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none">
              Hello, my
              <br />
              name's{" "}
              <span className="whitespace-nowrap bg-gradient-hero bg-clip-text text-transparent">
                Kobe Li
              </span>
              .<br />
              I like doing
              <br />
              random shit
            </h1>

            <div className="flex items-center space-x-2 text-lg text-muted-foreground">
              <span>
                “Dear friends, do you know that you are lucky people? You don't
                have any cows to lose.” - Thich Nhat Hanh
              </span>
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
