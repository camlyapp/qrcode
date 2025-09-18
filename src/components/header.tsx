"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CardTitle } from "@/components/ui/card";

type Theme = "light" | "dark";

export function Header() {
  const [theme, setTheme] = useState<Theme>("light");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("qrick-theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("light");
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("qrick-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("qrick-theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border/40 bg-background/95 backdrop-blur-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="relative flex items-center justify-center h-10">
            <Image 
                src="/camly.png" 
                alt="QRick Background Logo" 
                width={32} 
                height={32} 
                className="absolute left-0 top-1 h-8 w-8 opacity-20"
                aria-hidden="true"
            />
            <CardTitle className="text-xl font-bold tracking-tight pl-2">QRick</CardTitle>
        </Link>
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
      </div>
    </header>
  );
}
