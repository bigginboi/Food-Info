import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link to="/home" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-natural shadow-lg">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-none tracking-tight text-foreground xl:text-xl">
              Food Label Info
            </h1>
            <p className="text-xs text-muted-foreground">AI Ingredient Interpreter</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
