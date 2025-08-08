"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CardDescription, CardTitle } from "@/components/ui/card";

type Theme = 'light' | 'dark';

export function Header() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('qrick-theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(defaultTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('qrick-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground rounded-full p-2">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-headline">QRick</CardTitle>
            <CardDescription className="text-xs">
              Generate and customize your barcodes and QR codes in real-time.
            </CardDescription>
          </div>
        </div>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Toggle Theme</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </header>
  );
}
