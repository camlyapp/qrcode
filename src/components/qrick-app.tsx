"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
type QRStyle = "squares" | "dots";

const colorPresets = [
    { name: "Classic", fg: "#000000", bg: "#ffffff" },
    { name: "Ocean", fg: "#0A74DA", bg: "#F0F8FF" },
    { name: "Forest", fg: "#228B22", bg: "#F5F5F5" },
    { name: "Sunset", fg: "#FF4500", bg: "#FFF8DC" },
    { name: "Royal", fg: "#4169E1", bg: "#F8F8FF" },
    { name: "Charcoal", fg: "#36454F", bg: "#F5F5F5" },
    { name: "Mint", fg: "#3EB489", bg: "#F5FFFA" },
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
  const [qrStyle, setQrStyle] = useState<QRStyle>("squares");

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

  useEffect(() => {
    if (qrStyle === 'dots') {
      const canvas = qrRef.current?.querySelector('canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // This is a hack to customize the rendering of the QR code modules
          // We are monkey-patching the drawImage function of the canvas context
          const originalDrawImage = ctx.drawImage;
          (ctx as any).drawImage = (...args: any[]) => {
            if (args.length === 9) {
                // This is a module draw operation
                const [image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight] = args;
                
                // Create a temporary canvas to analyze the module
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = sWidth;
                tempCanvas.height = sHeight;
                const tempCtx = tempCanvas.getContext('2d');

                if (tempCtx) {
                    tempCtx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
                    const imageData = tempCtx.getImageData(0, 0, sWidth, sHeight);
                    const isTransparent = imageData.data[3] === 0;

                    if (!isTransparent) {
                        ctx.save();
                        // Use a circular clipping path to draw dots
                        ctx.beginPath();
                        ctx.arc(dx + dWidth / 2, dy + dHeight / 2, dWidth / 2.2, 0, 2 * Math.PI);
                        ctx.clip();
                        originalDrawImage.apply(ctx, args);
                        ctx.restore();
                    }
                }
            } else {
                // This is likely the embedded image draw operation, pass it through
                originalDrawImage.apply(ctx, args);
            }
          };
        }
      }
    }
  }, [content, size, level, bgColor, fgColor, imageSettings, qrStyle]);

  return (
    <Card className="w-full max-w-4xl shadow-2xl">
      <CardHeader className="text-center p-4">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full p-2 w-fit mb-2">
            <QrCode className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-headline">QRick</CardTitle>
        <CardDescription className="text-xs">
          Generate and customize your QR code in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 p-4">
        <div className="grid gap-4">
            <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content"><Text className="mr-2"/>Content</TabsTrigger>
                    <TabsTrigger value="style"><Palette className="mr-2"/>Style</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="pt-4">
                     <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Input
                            id="content"
                            placeholder="Enter URL or text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="text-sm"
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
                <TabsContent value="style" className="pt-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label>Module Style</Label>
                          <RadioGroup defaultValue="squares" value={qrStyle} onValueChange={(v) => setQrStyle(v as QRStyle)} className="flex gap-4">
                              <Label htmlFor="style-squares" className="flex items-center gap-2 cursor-pointer text-sm">
                                  <RadioGroupItem value="squares" id="style-squares" />
                                  Squares
                              </Label>
                              <Label htmlFor="style-dots" className="flex items-center gap-2 cursor-pointer text-sm">
                                  <RadioGroupItem value="dots" id="style-dots" />
                                  Dots
                              </Label>
                          </RadioGroup>
                        </div>
                        <Separator />
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
                                    <Input id="fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="p-1 h-9" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bg-color">Background</Label>
                                <div className="relative">
                                    <Input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-1 h-9" />
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid gap-3">
                            <div className="grid gap-2">
                              <Label>Center Image</Label>
                               <Input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden"/>
                               <Button variant="outline" size="sm" onClick={triggerFileSelect}>
                                   <ImageIcon className="mr-2" />
                                   {imageUrl ? "Change Image" : "Upload Image"}
                               </Button>
                               {imageUrl && (
                                    <Button variant="destructive" size="xs" onClick={removeImage}>
                                        <X className="mr-2" />
                                        Remove
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
        
        <div className="flex justify-center items-center rounded-lg bg-muted p-2">
            <div ref={qrRef} className="p-2 bg-white rounded-md shadow-inner transition-all duration-300 ease-in-out" aria-label="QR Code Preview">
              {content ? (
                <QRCodeCanvas
                    key={`${qrStyle}-${content}-${size}-${level}-${bgColor}-${fgColor}-${JSON.stringify(imageSettings)}`}
                    value={content}
                    size={size}
                    level={level}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    imageSettings={imageSettings}
                    includeMargin={true}
                />
              ) : (
                <div style={{width: size, height: size}} className="bg-gray-100 flex items-center justify-center text-center text-gray-500 rounded-lg p-4">
                    Enter content to generate QR code.
                </div>
              )}
            </div>
        </div>

      </CardContent>
      <CardFooter className="p-4">
        <Button onClick={handleDownload} className="w-full text-base py-5" disabled={!content}>
          <Download className="mr-2 h-5 w-5" />
          Download PNG
        </Button>
      </CardFooter>
    </Card>
  );
}
