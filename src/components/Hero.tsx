import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import HeroPlayground from "@/components/HeroPlayground";

const prefillDealSubject = () => {
  const subject = document.getElementById("subject") as HTMLInputElement | null;
  if (subject && !subject.value) subject.value = "Deal: ";
};

const Hero = () => (
  <section className="home-hero page-width" aria-labelledby="hello-title">
    <div className="hero-copy">
      <h1 id="hello-title">Hello,<br />I’m <em>Kobe Li.</em></h1>
      <p className="hero-intro">I like doing random shit.</p>
      <blockquote className="hero-quote">
        <p>“Dear friends, do you know that you are lucky people? You don't have any cows to lose.”</p>
        <cite>— Thich Nhat Hanh</cite>
      </blockquote>
      <div className="hero-links">
        <a href="#about" className="solid-link">A little about me <ArrowDown size={17} /></a>
        <Link to="/gallery" className="text-link">Explore my photos <ArrowUpRight size={16} /></Link>
      </div>
      <a href="#contact" onClick={prefillDealSubject} className="deal-link">Looking for private deals <ArrowUpRight size={14} /></a>
    </div>
    <HeroPlayground />
  </section>
);

export default Hero;
