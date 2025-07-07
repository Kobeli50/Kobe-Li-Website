import { Github, Twitter, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
          
          <div className="text-center text-muted-foreground">
            <p className="flex items-center justify-center space-x-2">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-pink fill-pink" />
              <span>using React & TypeScript</span>
            </p>
            <p className="mt-2 text-sm">
              © 2024 Your Name. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;