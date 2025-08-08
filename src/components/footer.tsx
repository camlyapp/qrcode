import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t p-4">
      <div className="container mx-auto flex items-center justify-center text-sm text-muted-foreground">
        <p className="flex items-center">
          Made with <Heart className="mx-1 h-4 w-4 text-red-500" /> by{' '}
          <a
            href="https://your-portfolio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 font-semibold text-primary hover:underline"
          >
            Your Name
          </a>
        </p>
      </div>
    </footer>
  );
}
