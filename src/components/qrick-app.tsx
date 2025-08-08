
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { Download, QrCode, Image as ImageIcon, Palette, Text, X, Waves, Diamond, Shield, GitCommitHorizontal, CircleDot, Barcode } from "lucide-react";

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
type QRStyle = "squares" | "dots" | "rounded" | "fluid" | "wavy" | "diamond";
type GradientType = "none" | "linear" | "radial";
type BarcodeFormat = "QR" | "CODE128" | "EAN13" | "EAN8" | "UPC" | "CODE39" | "ITF14" | "MSI" | "pharmacode";

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
  const [format, setFormat] = useState<BarcodeFormat>("QR");
  const [content, setContent] = useState<string>("https://firebase.google.com");
  const [size, setSize] = useState<number>(256);
  const [level, setLevel] = useState<ErrorCorrectionLevel>("M");
  const [fgColor, setFgColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageSize, setImageSize] = useState<number>(60);
  const [excavate, setExcavate] = useState<boolean>(true);
  const [qrStyle, setQrStyle] = useState<QRStyle>("squares");
  const [useShieldCorners, setUseShieldCorners] = useState<boolean>(false);
  const [gradientType, setGradientType] = useState<GradientType>("none");
  const [gradientStartColor, setGradientStartColor] = useState<string>("#8A2BE2");
  const [gradientEndColor, setGradientEndColor] = useState<string>("#4682B4");
  const [barcodeError, setBarcodeError] = useState<string | null>(null);


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const drawQR = useCallback(() => {
    setBarcodeError(null);
    const canvas = canvasRef.current;
    if (!canvas) return;

    QRCode.toDataURL(content, {
        errorCorrectionLevel: level,
        width: size,
        margin: 1,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    })
    .then(() => {
        const qrCode = QRCode.create(content, { errorCorrectionLevel: level });
        const moduleCount = qrCode.modules.size;
        const moduleSize = size / moduleCount;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        
        if (gradientType !== 'none') {
            let gradient: CanvasGradient;
            if (gradientType === 'linear') {
                gradient = ctx.createLinearGradient(0, 0, size, size);
            } else { // radial
                gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
            }
            gradient.addColorStop(0, gradientStartColor);
            gradient.addColorStop(1, gradientEndColor);
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = fgColor;
        }


        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (qrCode.modules.get(row, col)) {
                    const moduleX = col * moduleSize;
                    const moduleY = row * moduleSize;

                    const isFinderPattern = (row < 7 && col < 7) || (row < 7 && col >= moduleCount - 7) || (row >= moduleCount - 7 && col < 7);
                    
                    if (useShieldCorners && isFinderPattern) {
                        const radius = 0.5 * moduleSize;
                        ctx.beginPath();
                        ctx.moveTo(moduleX, moduleY + radius);
                        ctx.lineTo(moduleX, moduleY + moduleSize - radius);
                        ctx.quadraticCurveTo(moduleX, moduleY + moduleSize, moduleX + radius, moduleY + moduleSize);
                        ctx.lineTo(moduleX + moduleSize - radius, moduleY + moduleSize);
                        ctx.quadraticCurveTo(moduleX + moduleSize, moduleY + moduleSize, moduleX + moduleSize, moduleY + moduleSize - radius);
                        ctx.lineTo(moduleX + moduleSize, moduleY + radius);
                        ctx.quadraticCurveTo(moduleX + moduleSize, moduleY, moduleX + moduleSize - radius, moduleY);
                        ctx.lineTo(moduleX + radius, moduleY);
                        ctx.quadraticCurveTo(moduleX, moduleY, moduleX, moduleY + radius);
                        ctx.closePath();
                        ctx.fill();
                        continue;
                    }

                    if (qrStyle === 'dots') {
                        ctx.beginPath();
                        ctx.arc(moduleX + moduleSize / 2, moduleY + moduleSize / 2, (moduleSize / 2.2), 0, 2 * Math.PI);
                        ctx.fill();
                    } else if (qrStyle === 'wavy') {
                        ctx.beginPath();
                        ctx.moveTo(moduleX, moduleY + moduleSize / 2);
                        ctx.quadraticCurveTo(moduleX + moduleSize / 2, moduleY - moduleSize / 2, moduleX + moduleSize, moduleY + moduleSize / 2);
                        ctx.quadraticCurveTo(moduleX + moduleSize / 2, moduleY + moduleSize * 1.5, moduleX, moduleY + moduleSize / 2);
                        ctx.closePath();
                        ctx.fill();
                    } else if (qrStyle === 'diamond') {
                        ctx.beginPath();
                        ctx.moveTo(moduleX + moduleSize / 2, moduleY);
                        ctx.lineTo(moduleX + moduleSize, moduleY + moduleSize / 2);
                        ctx.lineTo(moduleX + moduleSize / 2, moduleY + moduleSize);
                        ctx.lineTo(moduleX, moduleY + moduleSize / 2);
                        ctx.closePath();
                        ctx.fill();
                    } else if (qrStyle === 'rounded' || qrStyle === 'fluid') {
                        const radius = (qrStyle === 'fluid' ? 0.5 : 0.25) * moduleSize;
                        
                        const top = row > 0 && qrCode.modules.get(row - 1, col);
                        const bottom = row < moduleCount - 1 && qrCode.modules.get(row + 1, col);
                        const left = col > 0 && qrCode.modules.get(row, col - 1);
                        const right = col < moduleCount - 1 && qrCode.modules.get(row, col + 1);

                        ctx.beginPath();
                        ctx.moveTo(moduleX + radius, moduleY);
                        ctx.lineTo(moduleX + moduleSize - radius, moduleY);
                        if (!top && !right) ctx.quadraticCurveTo(moduleX + moduleSize, moduleY, moduleX + moduleSize, moduleY + radius);
                        else ctx.lineTo(moduleX + moduleSize, moduleY + radius);

                        ctx.lineTo(moduleX + moduleSize, moduleY + moduleSize - radius);
                        if (!bottom && !right) ctx.quadraticCurveTo(moduleX + moduleSize, moduleY + moduleSize, moduleX + moduleSize - radius, moduleY + moduleSize);
                        else ctx.lineTo(moduleX + moduleSize - radius, moduleY + moduleSize);

                        ctx.lineTo(moduleX + radius, moduleY + moduleSize);
                        if (!bottom && !left) ctx.quadraticCurveTo(moduleX, moduleY + moduleSize, moduleX, moduleY + moduleSize - radius);
                        else ctx.lineTo(moduleX, moduleY + moduleSize - radius);

                        ctx.lineTo(moduleX, moduleY + radius);
                        if (!top && !left) ctx.quadraticCurveTo(moduleX, moduleY, moduleX + radius, moduleY);
                        else ctx.lineTo(moduleX + radius, moduleY);

                        ctx.closePath();
                        ctx.fill();
                    } else {
                        ctx.fillRect(moduleX, moduleY, moduleSize, moduleSize);
                    }
                }
            }
        }

        if (imageUrl) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imageUrl;
            img.onload = () => {
                const imgX = (size - imageSize) / 2;
                const imgY = (size - imageSize) / 2;
                
                if (excavate) {
                    ctx.clearRect(imgX, imgY, imageSize, imageSize);
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(imgX, imgY, imageSize, imageSize);
                }
                ctx.drawImage(img, imgX, imgY, imageSize, imageSize);
            };
        }
    })
    .catch(err => {
        setBarcodeError("Error generating QR code. The content may be too long for the selected error correction level.");
        console.error(err);
    });
  }, [content, size, level, fgColor, bgColor, qrStyle, imageUrl, imageSize, excavate, useShieldCorners, gradientType, gradientStartColor, gradientEndColor]);

  const drawBarcode = useCallback(() => {
    setBarcodeError(null);
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        JsBarcode(canvas, content, {
            format: format,
            lineColor: fgColor,
            background: bgColor,
            width: 2,
            height: 100,
            displayValue: true,
            valid: (valid: boolean) => {
                if (!valid) {
                     setBarcodeError("Invalid content for the selected barcode format.");
                }
            }
        });
    } catch (err: any) {
        setBarcodeError(err.message || "Error generating barcode.");
        console.error(err);
    }
  }, [content, format, fgColor, bgColor]);


  useEffect(() => {
      if (content) {
        if (format === 'QR') {
            drawQR();
        } else {
            drawBarcode();
        }
      } else {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            ctx.clearRect(0,0,size,size);
        }
        setBarcodeError(null);
      }
  }, [drawQR, drawBarcode, content, size, format]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || barcodeError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: barcodeError || "Could not find code to download.",
      });
      return;
    }

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
      
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${format.toLowerCase()}-code.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    toast({
      title: "Success",
      description: "Download started.",
    });
  }, [toast, format, barcodeError]);

  const applyPreset = (preset: {fg: string, bg: string}) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);
    setGradientType("none");
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

  return (
    <Card className="w-full max-w-4xl shadow-2xl">
      <CardHeader className="text-center p-4">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full p-2 w-fit mb-2">
            <Barcode className="h-5 w-5" />
        </div>
        <CardTitle className="text-lg font-headline">QRick</CardTitle>
        <CardDescription className="text-xs">
          Generate and customize your barcodes and QR codes in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-[340px_1fr] p-4">
        <div className="grid gap-4">
            <Tabs defaultValue="type" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="type"><Barcode className="mr-2"/>Type</TabsTrigger>
                    <TabsTrigger value="content"><Text className="mr-2"/>Content</TabsTrigger>
                    <TabsTrigger value="style" disabled={format !== 'QR'}><Palette className="mr-2"/>Style</TabsTrigger>
                </TabsList>
                <TabsContent value="type" className="pt-4">
                     <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="format">Format</Label>
                            <Select
                                value={format}
                                onValueChange={(value: BarcodeFormat) => {
                                    setFormat(value);
                                    if(value !== 'QR' && content === 'https://firebase.google.com') {
                                        setContent('123456789012');
                                    } else if (value === 'QR' && content === '123456789012') {
                                        setContent('https://firebase.google.com');
                                    }
                                }}
                            >
                                <SelectTrigger id="format">
                                <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="QR">QR Code</SelectItem>
                                    <SelectItem value="CODE128">Code 128</SelectItem>
                                    <SelectItem value="EAN13">EAN-13</SelectItem>
                                    <SelectItem value="EAN8">EAN-8</SelectItem>
                                    <SelectItem value="UPC">UPC</SelectItem>
                                    <SelectItem value="CODE39">Code 39</SelectItem>
                                    <SelectItem value="ITF14">ITF-14</SelectItem>
                                    <SelectItem value="MSI">MSI</SelectItem>
                                    <SelectItem value="pharmacode">Pharmacode</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </TabsContent>
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
                        {format === 'QR' && (
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
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="style" className="pt-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label>Module Style</Label>
                          <RadioGroup defaultValue="squares" value={qrStyle} onValueChange={(v) => setQrStyle(v as QRStyle)} className="flex flex-wrap gap-4">
                              <Label htmlFor="style-squares" className="flex items-center gap-2 cursor-pointer text-sm">
                                  <RadioGroupItem value="squares" id="style-squares" />
                                  Squares
                              </Label>
                              <Label htmlFor="style-dots" className="flex items-center gap-2 cursor-pointer text-sm">
                                  <RadioGroupItem value="dots" id="style-dots" />
                                  Dots
                              </Label>
                              <Label htmlFor="style-rounded" className="flex items-center gap-2 cursor-pointer text-sm">
                                  <RadioGroupItem value="rounded" id="style-rounded" />
                                  Rounded
                              </Label>
                              <Label htmlFor="style-fluid" className="flex items-center gap-2 cursor-pointer text-sm">
                                  <RadioGroupItem value="fluid" id="style-fluid" />
                                  Fluid
                              </Label>
                              <Label htmlFor="style-wavy" className="flex items-center gap-2 cursor-pointer text-sm">
                                  <RadioGroupItem value="wavy" id="style-wavy" />
                                  Wavy
                              </Label>
                              <Label htmlFor="style-diamond" className="flex items-center gap-2 cursor-pointer text-sm">
                                  <RadioGroupItem value="diamond" id="style-diamond" />
                                  Diamond
                              </Label>
                          </RadioGroup>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Switch id="shield-corners" checked={useShieldCorners} onCheckedChange={setUseShieldCorners} />
                            <Label htmlFor="shield-corners" className="flex items-center gap-2 cursor-pointer">
                                <Shield className="h-4 w-4" />
                                Use Shielded Corners
                            </Label>
                        </div>
                        <Separator />
                        <div className="grid gap-2">
                            <Label>Color Presets</Label>
                            <TooltipProvider>
                                <div className="flex flex-wrap gap-2">
                                    {colorPresets.map(preset => (
                                        <Tooltip key={preset.name}>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="icon" onClick={() => applyPreset(preset)} className="h-8 w-8">
                                                    <span className="w-4 h-4 rounded-full" style={{backgroundColor: preset.fg, border: `2px solid ${preset.bg === '#ffffff' ? '#f0f0f0' : preset.bg}`}}></span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{preset.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </TooltipProvider>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="fg-color">Foreground</Label>
                                <div className="relative">
                                    <Input id="fg-color" type="color" value={fgColor} onChange={(e) => { setFgColor(e.target.value); setGradientType("none"); }} className="p-1 h-9" />
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
                            <div className="flex items-center space-x-2">
                                <Switch id="gradient-switch" checked={gradientType !== 'none'} onCheckedChange={(checked) => setGradientType(checked ? 'linear' : 'none')} />
                                <Label htmlFor="gradient-switch" className="cursor-pointer">Use Gradient</Label>
                            </div>
                            {gradientType !== 'none' && (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Gradient Type</Label>
                                        <RadioGroup value={gradientType} onValueChange={(v) => setGradientType(v as GradientType)} className="flex gap-4">
                                            <Label htmlFor="gradient-linear" className="flex items-center gap-2 cursor-pointer text-sm">
                                                <RadioGroupItem value="linear" id="gradient-linear" />
                                                <GitCommitHorizontal className="h-4 w-4" /> Linear
                                            </Label>
                                            <Label htmlFor="gradient-radial" className="flex items-center gap-2 cursor-pointer text-sm">
                                                <RadioGroupItem value="radial" id="gradient-radial" />
                                                <CircleDot className="h-4 w-4" /> Radial
                                            </Label>
                                        </RadioGroup>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="gradient-start">Start Color</Label>
                                            <Input id="gradient-start" type="color" value={gradientStartColor} onChange={(e) => setGradientStartColor(e.target.value)} className="p-1 h-9" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="gradient-end">End Color</Label>
                                            <Input id="gradient-end" type="color" value={gradientEndColor} onChange={(e) => setGradientEndColor(e.target.value)} className="p-1 h-9" />
                                        </div>
                                    </div>
                                </>
                            )}
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
            <div className="p-2 bg-white rounded-md shadow-inner transition-all duration-300 ease-in-out" aria-label="Barcode Preview">
              {content && !barcodeError ? (
                <canvas ref={canvasRef} width={format === 'QR' ? size : '320'} height={format === 'QR' ? size : '160'} />
              ) : (
                <div style={{width: size, height: size}} className="bg-gray-100 flex items-center justify-center text-center text-red-500 rounded-lg p-4">
                    {barcodeError || 'Enter content to generate a code.'}
                </div>
              )}
            </div>
        </div>

      </CardContent>
      <CardFooter className="p-4">
        <Button onClick={handleDownload} className="w-full text-base py-5" disabled={!content || !!barcodeError}>
          <Download className="mr-2 h-5 w-5" />
          Download PNG
        </Button>
      </CardFooter>
    </Card>
  );
}
