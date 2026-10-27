import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubstackIcon from "@/components/icons/SubstackIcon";

const Blogs = () => (
  <div>
    <Header />
    <main id="main-content" className="page-width writing-page">
      <p className="eyebrow">Notes & thoughts</p>
      <h1>Writing.</h1>
      <p>Writing on random thoughts.</p>
      <a href="https://substack.com/@kobeli2" target="_blank" rel="noopener noreferrer" className="writing-link">
        <SubstackIcon className="h-7 w-7 shrink-0" />
        <div><strong>Read & subscribe on Substack</strong><p>Where all my writing lives.</p></div>
        <ArrowUpRight size={22} />
      </a>
    </main>
    <Footer />
  </div>
);

export default Blogs;
