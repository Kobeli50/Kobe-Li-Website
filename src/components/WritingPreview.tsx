import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import SubstackIcon from "@/components/icons/SubstackIcon";
import "./WritingPreview.css";

const WritingPreview = () => (
  <section id="writing" className="home-writing page-width" aria-labelledby="home-writing-title">
    <div className="home-writing__inner">
      <div className="home-writing__heading">
        <h2 id="home-writing-title">Writing</h2>
        <Link to="/blogs" className="text-link">View all writing <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
      <a className="home-writing__entry" href="https://substack.com/@kobeli2" target="_blank" rel="noopener noreferrer">
        <span className="home-writing__icon"><SubstackIcon aria-hidden="true" /></span>
        <div className="home-writing__copy">
          <h3>Substack</h3>
        </div>
        <span className="home-writing__read">Read &amp; subscribe <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></span>
      </a>
    </div>
  </section>
);

export default WritingPreview;
