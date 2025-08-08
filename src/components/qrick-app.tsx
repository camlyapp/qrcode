"use client";

import { useState, useRef, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode, Image as ImageIcon, Palette, Text, X } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

const colorPresets = [
    { name: "Classic", fg: "#000000", bg: "#ffffff" },
    { name: "Ocean", fg: "#0A74DA", bg: "#F0F8FF" },
    { name: "Forest", fg: "#228B22", bg: "#F5F5F5" },
    { name: "Sunset", fg: "#FF4500", bg: "#FFF8DC" },
    { name: "Royal", fg: "#4169E1", bg: "#F8F8FF" },
    { name: "Charcoal", fg: "#36454F", bg: "#F5F5F5" },
];


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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const applyPreset = (preset: {fg: string, bg: string}) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const removeImage = () => {
    setImageUrl("");
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const imageSettings = imageUrl ? {
    src: imageUrl,
    height: imageSize,
    width: imageSize,
    excavate: excavate,
  } : undefined;

  return (
    <Card className="w-full max-w-4xl shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-2">
            <QrCode className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl font-headline">QRick</CardTitle>
        <CardDescription>
          Generate and customize your QR code in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-2 p-6">
        <div className="grid gap-6">
            <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content"><Text className="mr-2"/>Content</TabsTrigger>
                    <TabsTrigger value="style"><Palette className="mr-2"/>Style</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="pt-6">
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
                    </div>
                </TabsContent>
                <TabsContent value="style" className="pt-6">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label>Color Presets</Label>
                            <div className="flex flex-wrap gap-2">
                                {colorPresets.map(preset => (
                                    <Button key={preset.name} variant="outline" size="sm" onClick={() => applyPreset(preset)}>
                                        <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: preset.fg}}></span>
                                        {preset.name}
                                    </Button>
                                ))}
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
                              <Label>Center Image</Label>
                               <Input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden"/>
                               <Button variant="outline" onClick={triggerFileSelect}>
                                   <ImageIcon className="mr-2" />
                                   {imageUrl ? "Change Image" : "Upload Image"}
                               </Button>
                               {imageUrl && (
                                    <Button variant="destructive" size="sm" onClick={removeImage}>
                                        <X className="mr-2" />
                                        Remove Image
                                    </Button>
                               )}
                            </div>
                            {imageUrl && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="image-size">Image Size ({imageSize}px)</Label>
                                        <Slider id="image-size" min={20} max={size / 3} value={[imageSize]} onValueChange={(v) => setImageSize(v[0])} />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="excavate" checked={excavate} onCheckedChange={setExcavate} />
                                        <Label htmlFor="excavate">Clear space for image</Label>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
        
        <div className="flex justify-center items-center rounded-lg bg-muted p-4">
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
