import { socialLinks } from "@/lib/socialLinks";

const Footer = () => (
  <footer className="site-footer">
    <div className="page-width footer-inner">
      <p className="footer-signature">Thanks for stopping by.<span>© {new Date().getFullYear()} Kobe Li</span></p>
      <nav className="footer-links" aria-label="Find me elsewhere">
        {socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon className="h-[18px] w-[18px]" /></a>)}
      </nav>
    </div>
  </footer>
);

export default Footer;
