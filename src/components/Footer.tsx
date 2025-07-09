import {
  Github,
  Twitter,
  Linkedin,
  Heart,
  Book,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-6">
            <a
              href="https://www.linkedin.com/in/kobeli50/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/kobeli50/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.goodreads.com/user/show/187557631-kobe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Book className="w-6 h-6" />
            </a>
            <a
              href="https://x.com/Kobeli50"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/Kobeli50"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>

          <div className="text-center text-muted-foreground">
            <p className="flex items-center justify-center space-x-2"></p>
            <p className="mt-2 text-sm">© 2025 Kobe Li. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
