"use client";

import { useState, useRef, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export function QrickApp() {
  const [content, setContent] = useState<string>("https://firebase.google.com");
  const [size, setSize] = useState<number>(256);
  const [level, setLevel] = useState<ErrorCorrectionLevel>("M");
  const [fgColor, setFgColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageSize, setImageSize] = useState<number>(60);
  const [excavate, setExcavate] = useState<boolean>(true);

  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = useCallback(() => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector<HTMLCanvasElement>("canvas");
    if (!canvas) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find QR code to download.",
      });
      return;
    }

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
      
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrick-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    toast({
      title: "Success",
      description: "QR code download started.",
    });
  }, [toast]);

  const imageSettings = imageUrl ? {
    src: imageUrl,
    height: imageSize,
    width: imageSize,
    excavate: excavate,
  } : undefined;

  return (
    <Card className="w-full max-w-lg shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-2">
            <QrCode className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl font-headline">QRick</CardTitle>
        <CardDescription>
          Generate and customize your QR code in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Input
              id="content"
              placeholder="Enter URL or text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="text-base"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="size">Size (px)</Label>
              <Input
                id="size"
                type="number"
                min="64"
                max="1024"
                step="32"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10) || 64)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="level">Error Correction</Label>
              <Select
                value={level}
                onValueChange={(value: ErrorCorrectionLevel) => setLevel(value)}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (L)</SelectItem>
                  <SelectItem value="M">Medium (M)</SelectItem>
                  <SelectItem value="Q">Quartile (Q)</SelectItem>
                  <SelectItem value="H">High (H)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="fg-color">Foreground</Label>
                    <div className="relative">
                        <Input id="fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="p-1 h-10" />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="bg-color">Background</Label>
                    <div className="relative">
                        <Input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-1 h-10" />
                    </div>
                </div>
            </div>
            <Separator />
            <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="image-url">Image URL (optional)</Label>
                  <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="image-url" placeholder="https://example.com/logo.png" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="pl-9" />
                  </div>
                </div>
                {imageUrl && (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="image-size">Image Size (px)</Label>
                            <Input id="image-size" type="range" min="20" max={size / 3} value={imageSize} onChange={(e) => setImageSize(parseInt(e.target.value, 10))} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="excavate" checked={excavate} onCheckedChange={setExcavate} />
                            <Label htmlFor="excavate">Clear space for image</Label>
                        </div>
                    </>
                )}
            </div>
        </div>
        
        <div className="flex justify-center items-center">
            <div ref={qrRef} className="p-4 bg-white rounded-lg shadow-inner transition-all duration-300 ease-in-out" aria-label="QR Code Preview">
              {content ? (
                <QRCodeCanvas
                    value={content}
                    size={size}
                    level={level}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    imageSettings={imageSettings}
                />
              ) : (
                <div style={{width: size, height: size}} className="bg-gray-100 flex items-center justify-center text-center text-gray-500 rounded-lg p-4">
                    Enter content to generate QR code.
                </div>
              )}
            </div>
        </div>

      </CardContent>
      <CardFooter>
        <Button onClick={handleDownload} className="w-full text-lg py-6" disabled={!content}>
          <Download className="mr-2 h-5 w-5" />
          Download PNG
        </Button>
      </CardFooter>
    </Card>
  );
}
