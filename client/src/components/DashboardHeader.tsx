import { Button } from "@/components/ui/button";
import { PlusIcon, MoonIcon, SunIcon, BookOpenIcon } from "lucide-react";
import { useState } from "react";

interface DashboardHeaderProps {
  onCreateProject: () => void;
}

export function DashboardHeader({ onCreateProject }: DashboardHeaderProps) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                All Nighter
              </h1>
            </div>
            <div className="hidden sm:block text-sm text-muted-foreground">
              Your AI-powered study companion
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
            
            <Button 
              onClick={onCreateProject}
              variant="study"
              className="gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">New Project</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}