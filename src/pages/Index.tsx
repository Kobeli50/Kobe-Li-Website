import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PastWorkExperience from "@/components/PastWorkExperience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <PastWorkExperience />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
