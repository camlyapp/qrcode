import { Heart, Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-muted/40 py-8">
      <div className="container mx-auto grid grid-cols-1 items-center justify-items-center gap-4 text-center text-sm text-muted-foreground md:grid-cols-3 md:justify-items-stretch">
        <p className="flex items-center justify-center md:justify-start">
          © {currentYear} Camly. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-4">
            <Link href="/features" className="hover:text-primary">Features</Link>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Github className="h-5 w-5" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Linkedin className="h-5 w-5" /></a>
        </div>
        <p className="flex items-center justify-center md:justify-end">
        </p>
      </div>
    </footer>
  );
}
