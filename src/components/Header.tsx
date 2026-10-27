import { Menu, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Project", href: "/#projects" },
  { label: "Writing", href: "/blogs" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/#contact" },
];

const Header = () => {
  const { pathname } = useLocation();
  const followedMobileLink = useRef(false);
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="page-width header-inner">
        <Link to="/" className="wordmark" aria-label="Kobe Li home">kobe li<span>.</span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map(({ label, href }) => (
            <a key={label} href={href} aria-current={href === "/gallery" && pathname.startsWith(href) ? "page" : href === pathname ? "page" : undefined}>
              {label}{label === "Contact" && <ArrowUpRight size={14} />}
            </a>
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild><button type="button" className="mobile-menu" aria-label="Open menu"><Menu size={23} /></button></SheetTrigger>
          <SheetContent className="flex flex-col gap-8" onCloseAutoFocus={(event) => {
            if (followedMobileLink.current) event.preventDefault();
            followedMobileLink.current = false;
          }}>
            <SheetTitle className="wordmark">kobe li.</SheetTitle>
            <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
              {navLinks.map(({ label, href }) => <SheetClose key={label} asChild><a className="text-xl" href={href} onClick={() => { followedMobileLink.current = true; }}>{label}</a></SheetClose>)}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
