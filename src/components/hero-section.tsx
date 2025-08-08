"use client";

import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

export function HeroSection() {
    const scrollToApp = () => {
        const appElement = document.querySelector('main');
        if (appElement) {
            appElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-background to-muted/40">
            <div className="container mx-auto text-center px-4 md:px-6">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                        Create Stunning <span className="text-primary">QR Codes</span> &amp; Barcodes
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        Design professional, custom QR codes and barcodes in seconds. Easy to use, free to download, and ready for anything.
                    </p>
                </div>
                <div className="mt-8">
                    <Button size="lg" onClick={scrollToApp}>
                        Get Started
                        <ArrowDown className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
