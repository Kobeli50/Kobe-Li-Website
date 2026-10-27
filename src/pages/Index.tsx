import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SelectedPhotos from "@/components/SelectedPhotos";
import WritingPreview from "@/components/WritingPreview";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main id="main-content">
      <Hero />
      <About />
      <Projects />
      <WritingPreview />
      <SelectedPhotos />
      <Contact />
    </main>
    <Footer />
  </div>
);

export default Index;
