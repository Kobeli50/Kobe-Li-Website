import { Github, Instagram, Twitter, Linkedin, Book, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SubstackIcon from "@/components/icons/SubstackIcon";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kobeli50/", icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/kobeli50/", icon: Instagram },
  { label: "Goodreads", href: "https://www.goodreads.com/user/show/187557631-kobe", icon: Book },
  { label: "Substack", href: "https://substack.com/@kobeli2", icon: SubstackIcon },
  { label: "X", href: "https://x.com/Kobeli50", icon: Twitter },
  { label: "GitHub", href: "https://github.com/Kobeli50", icon: Github },
];

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between xl:grid xl:grid-cols-3">
          <div className="text-2xl font-bold tracking-tight">Kobe Li</div>

          <nav className="hidden xl:flex items-center justify-center space-x-6">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-3 xl:justify-self-end">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Button key={label} variant="ghost" size="icon" className="hidden sm:inline-flex" asChild>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon className="h-5 w-5" />
                </a>
              </Button>
            ))}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col gap-8">
                <SheetTitle className="text-2xl font-bold tracking-tight">Kobe Li</SheetTitle>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map(({ label, href }) => (
                    <SheetClose key={label} asChild>
                      <a
                        href={href}
                        className="text-xl text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
                <div className="flex flex-wrap -ml-2.5 sm:hidden">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <Button key={label} variant="ghost" size="icon" asChild>
                      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                        <Icon className="h-5 w-5" />
                      </a>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
