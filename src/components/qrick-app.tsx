
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { Download, QrCode, Image as ImageIcon, Palette, Text, X, Waves, Diamond, Shield, GitCommitHorizontal, CircleDot, Barcode, CaseSensitive, PaintBucket, ChevronDown, CreditCard, Mail, Phone, Globe } from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SVG } from "react-svg";


type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
type QRStyle = "squares" | "dots" | "rounded" | "fluid" | "wavy" | "diamond";
type GradientType = "none" | "linear" | "radial";
type GeneratorType = "qr" | "barcode";
type BarcodeFormat = "CODE128" | "CODE128A" | "CODE128B" | "CODE128C" | "EAN13" | "EAN8" | "EAN5" | "EAN2" | "UPC" | "UPCE" | "CODE39" | "ITF14" | "ITF" | "MSI" | "MSI10" | "MSI11" | "MSI1010" | "MSI1110" | "pharmacode" | "codabar";
type CardDesign = "classic" | "modern" | "sleek" | "professional" | "vcard";

interface CardElement {
    id: string;
    type: 'text' | 'barcode' | 'image';
    content?: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    font?: string;
    color?: string;
    align?: CanvasTextAlign;
}

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
  const [generatorType, setGeneratorType] = useState<GeneratorType>("qr");
  const [barcodeFormat, setBarcodeFormat] = useState<BarcodeFormat>("CODE128");
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
  const [barcodeHeight, setBarcodeHeight] = useState<number>(100);
  const [barcodeTextSize, setBarcodeTextSize] = useState<number>(20);
  const [textColor, setTextColor] = useState<string>("#000000");

  // Card states
  const [generateCard, setGenerateCard] = useState<boolean>(false);
  const [cardTitle, setCardTitle] = useState<string>("John Doe");
  const [cardSubtitle, setCardSubtitle] = useState<string>("Software Engineer");
  const [cardEmail, setCardEmail] = useState<string>("john.doe@example.com");
  const [cardPhone, setCardPhone] = useState<string>("+1 (123) 456-7890");
  const [cardWebsite, setCardWebsite] = useState<string>("example.com");
  const [cardBgColor, setCardBgColor] = useState<string>("#ffffff");
  const [cardTextColor, setCardTextColor] = useState<string>("#000000");
  const [cardDesign, setCardDesign] = useState<CardDesign>("classic");
  const [cardAccentColor, setCardAccentColor] = useState<string>("#3B82F6");
  const [cardElements, setCardElements] = useState<CardElement[]>([]);
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const drawQR = useCallback(() => {
    setBarcodeError(null);
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = size;
    canvas.height = size;

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

  const drawBarcodeOrCard = useCallback(() => {
    setBarcodeError(null);
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (generateCard) {
        const cardWidth = 400;
        const cardHeight = 225;
        const scale = 4;
        
        canvas.width = cardWidth * scale;
        canvas.height = cardHeight * scale;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background
        ctx.fillStyle = cardBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Card design elements
        switch (cardDesign) {
            case 'modern':
                ctx.fillStyle = cardAccentColor;
                ctx.fillRect(0, 0, 100 * scale, canvas.height);
                break;
            case 'sleek':
                ctx.fillStyle = cardAccentColor;
                ctx.fillRect(0, 0, canvas.width, 60 * scale);
                break;
            case 'professional':
                ctx.strokeStyle = cardAccentColor;
                ctx.lineWidth = 2 * scale;
                ctx.beginPath();
                ctx.moveTo(50 * scale, 95 * scale);
                ctx.lineTo(canvas.width - 50 * scale, 95 * scale);
                ctx.stroke();
                break;
            case 'vcard':
                ctx.fillStyle = cardAccentColor;
                ctx.fillRect(0, 0, canvas.width, 60 * scale);
                break;
        }

       // Draw elements
        cardElements.forEach(element => {
            if (element.type === 'text' && element.content) {
                ctx.fillStyle = element.color || cardTextColor;
                ctx.font = element.font || `16px sans-serif`;
                ctx.textAlign = element.align || 'center';
                ctx.fillText(element.content, element.x, element.y);
            } else if (element.type === 'barcode') {
                try {
                    const tempCanvas = document.createElement('canvas');
                    let isValid = true;
                    JsBarcode(tempCanvas, content, {
                        format: barcodeFormat,
                        lineColor: fgColor,
                        background: 'rgba(0,0,0,0)',
                        width: 1.5 * scale,
                        height: 40 * scale,
                        displayValue: true,
                        fontOptions: "bold",
                        textAlign: "center",
                        textPosition: "bottom",
                        textMargin: 2 * scale,
                        fontSize: 12 * scale,
                        valid: (valid: boolean) => { isValid = valid; }
                    });
                    
                    if (!isValid) {
                        setBarcodeError("Invalid barcode content for card.");
                        return;
                    }
                    ctx.drawImage(tempCanvas, element.x, element.y, element.width!, element.height!);
                } catch (err: any) {
                    setBarcodeError(err.message || "Error generating barcode for card.");
                }
            }

            if (hoveredElement === element.id && element.width && element.height) {
                 ctx.strokeStyle = 'rgba(0, 123, 255, 0.7)';
                 ctx.lineWidth = 2;
                 ctx.strokeRect(element.x, element.y, element.width, element.height);
            }
        });


    } else {
        // Barcode-only Drawing Logic
        const displayWidth = 320;
        const displayHeight = 80;
        const scale = 4;
        
        canvas.width = displayWidth * scale;
        canvas.height = (displayHeight + (barcodeTextSize * 2.5 / 2)) * scale;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        try {
            const tempCanvas = document.createElement('canvas');
             let isValid = true;
            JsBarcode(tempCanvas, content, {
                format: barcodeFormat,
                lineColor: fgColor,
                background: 'rgba(0,0,0,0)',
                width: 2 * scale,
                height: 80 * scale,
                displayValue: false,
                valid: (valid: boolean) => { isValid = valid; }
            });
            
            if (!isValid) {
                setBarcodeError("Invalid content for the selected barcode format.");
                return;
            }

            const barcodeWidth = tempCanvas.width;
            const barcodeHeightCalculated = tempCanvas.height * (barcodeHeight / 100);

            if (ctx) {
                ctx.drawImage(tempCanvas, (canvas.width - barcodeWidth) / 2, 0, barcodeWidth, barcodeHeightCalculated);
                ctx.font = `${barcodeTextSize * scale}px monospace`;
                ctx.fillStyle = textColor;
                ctx.textAlign = 'center';
                ctx.fillText(content, canvas.width / 2, barcodeHeightCalculated + (barcodeTextSize * scale));
            }

        } catch (err: any) {
            setBarcodeError(err.message || "Error generating barcode.");
            const ctx = canvas?.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }
  }, [content, barcodeFormat, fgColor, bgColor, barcodeHeight, barcodeTextSize, textColor, generateCard, cardBgColor, cardTextColor, cardDesign, cardAccentColor, cardElements, hoveredElement]);


  // Initialize card elements based on design
  useEffect(() => {
    if (!generateCard) return;

    const scale = 4;
    const canvasWidth = 400 * scale;
    const canvasHeight = 225 * scale;
    const newElements: CardElement[] = [];

    // Common barcode properties
    const tempCanvas = document.createElement('canvas');
    try {
      JsBarcode(tempCanvas, content, { format: barcodeFormat, displayValue: false });
    } catch(e) { console.error("barcode error"); }
    const barcodeWidth = tempCanvas.width || 200 * scale;
    const barcodeHeightVal = tempCanvas.height || 40 * scale;

    const textElements: { [key: string]: Omit<CardElement, 'id' | 'type'> } = {
        title: { content: cardTitle, font: `bold ${24 * scale}px sans-serif`, align: 'center', color: cardTextColor },
        subtitle: { content: cardSubtitle, font: `${16 * scale}px sans-serif`, align: 'center', color: cardTextColor },
        email: { content: cardEmail, font: `${14 * scale}px sans-serif`, align: 'left', color: cardTextColor },
        phone: { content: cardPhone, font: `${14 * scale}px sans-serif`, align: 'left', color: cardTextColor },
        website: { content: cardWebsite, font: `${14 * scale}px sans-serif`, align: 'left', color: cardTextColor },
    };
    
    // Position elements based on design
    switch (cardDesign) {
        case 'classic':
            newElements.push({ id: 'title', type: 'text', ...textElements.title, x: canvasWidth / 2, y: 50 * scale });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, x: canvasWidth / 2, y: 80 * scale });
            newElements.push({ id: 'barcode', type: 'barcode', x: (canvasWidth - barcodeWidth) / 2, y: 120 * scale, width: barcodeWidth, height: barcodeHeightVal });
            break;
        case 'modern':
            const accentWidth = 100 * scale;
            newElements.push({ id: 'title', type: 'text', ...textElements.title, font: `bold ${22 * scale}px sans-serif`, align: 'left', x: accentWidth + 20 * scale, y: 60 * scale });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, font: `${14 * scale}px sans-serif`, align: 'left', x: accentWidth + 20 * scale, y: 90 * scale });
            newElements.push({ id: 'barcode', type: 'barcode', x: (canvasWidth - barcodeWidth + accentWidth) / 2, y: 120 * scale, width: barcodeWidth, height: barcodeHeightVal });
            break;
        case 'sleek':
            newElements.push({ id: 'title', type: 'text', ...textElements.title, font: `bold ${20 * scale}px sans-serif`, color: cardBgColor, align: 'left', x: 20 * scale, y: 40 * scale });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, font: `${14 * scale}px sans-serif`, align: 'left', x: 20 * scale, y: (60 * scale) + 30 * scale });
            newElements.push({ id: 'barcode', type: 'barcode', x: (canvasWidth - barcodeWidth) / 2, y: 110 * scale, width: barcodeWidth, height: barcodeHeightVal });
            break;
        case 'professional':
            newElements.push({ id: 'title', type: 'text', ...textElements.title, font: `bold ${22 * scale}px sans-serif`, x: canvasWidth / 2, y: 50 * scale });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, font: `${14 * scale}px sans-serif`, x: canvasWidth / 2, y: 75 * scale });
            newElements.push({ id: 'barcode', type: 'barcode', x: (canvasWidth - barcodeWidth) / 2, y: 115 * scale, width: barcodeWidth, height: barcodeHeightVal });
            break;
        case 'vcard':
            newElements.push({ id: 'title', type: 'text', ...textElements.title, font: `bold ${20 * scale}px sans-serif`, color: cardBgColor, align: 'left', x: 20 * scale, y: 30 * scale });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, font: `italic ${12 * scale}px sans-serif`, color: cardBgColor, align: 'left', x: 20 * scale, y: 50 * scale });
            const infoStartY = 80 * scale;
            const infoSpacing = 25 * scale;
            if(cardEmail) newElements.push({ id: 'email', type: 'text', ...textElements.email, x: 40 * scale, y: infoStartY });
            if(cardPhone) newElements.push({ id: 'phone', type: 'text', ...textElements.phone, x: 40 * scale, y: infoStartY + infoSpacing });
            if(cardWebsite) newElements.push({ id: 'website', type: 'text', ...textElements.website, x: 40 * scale, y: infoStartY + infoSpacing * 2 });
            newElements.push({ id: 'barcode', type: 'barcode', x: canvasWidth - barcodeWidth - 20 * scale, y: 155 * scale, width: barcodeWidth, height: barcodeHeightVal });
            break;
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
        newElements.forEach(el => {
            if (el.type === 'text' && el.font && el.content) {
                ctx.font = el.font;
                const metrics = ctx.measureText(el.content);
                el.width = metrics.width;
                el.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

                if (el.align === 'center') {
                    el.x -= el.width / 2;
                }
            }
        });
    }

    setCardElements(newElements);
}, [generateCard, cardDesign, cardTitle, cardSubtitle, cardEmail, cardPhone, cardWebsite, cardTextColor, cardBgColor, content, barcodeFormat, fgColor]);


  useEffect(() => {
      if (content) {
        if (generatorType === 'qr') {
            drawQR();
        } else if (generatorType === 'barcode') {
            drawBarcodeOrCard();
        }
      } else {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            if (generatorType === 'qr') {
                ctx.clearRect(0,0,size,size);
            } else if (generatorType === 'barcode') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        setBarcodeError(null);
      }
  }, [drawQR, drawBarcodeOrCard, content, size, generatorType, fgColor, bgColor, textColor, barcodeHeight, barcodeTextSize, level, qrStyle, imageUrl, imageSize, excavate, useShieldCorners, gradientType, gradientStartColor, gradientEndColor, generateCard, cardElements]);

    const getPointerPosition = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    };

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (!generateCard) return;
        e.preventDefault();
        const pos = getPointerPosition(e);

        const clickedElement = [...cardElements].reverse().find(el => 
            el.width && el.height &&
            pos.x >= el.x && pos.x <= el.x + el.width &&
            pos.y >= el.y && pos.y <= el.y + el.height
        );

        if (clickedElement) {
            setDraggingElement(clickedElement.id);
            setDragOffset({ x: pos.x - clickedElement.x, y: pos.y - clickedElement.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        const pos = getPointerPosition(e);
        if (draggingElement) {
             e.preventDefault();
            setCardElements(prev => prev.map(el =>
                el.id === draggingElement
                    ? { ...el, x: pos.x - dragOffset.x, y: pos.y - dragOffset.y }
                    : el
            ));
        } else if (generateCard) {
            const currentHoveredElement = [...cardElements].reverse().find(el => 
                el.width && el.height &&
                pos.x >= el.x && pos.x <= el.x + el.width &&
                pos.y >= el.y && pos.y <= el.y + el.height
            );
            setHoveredElement(currentHoveredElement?.id || null);
        }
    };

    const handleMouseUp = () => {
        setDraggingElement(null);
    };

  const handleDownload = useCallback(async (format: 'png' | 'jpeg' | 'svg') => {
    if (!content || barcodeError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: barcodeError || "Could not find code to download.",
      });
      return;
    }
    
    const downloadLink = document.createElement("a");
    const fileName = `${generatorType === 'qr' ? 'qr-code' : (generateCard ? 'card' : barcodeFormat.toLowerCase())}.${format}`;

    if (format === 'svg' && generatorType !== 'qr' && !generateCard) {
        let svgString = '';
        const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        document.body.appendChild(svgNode);
        try {
            JsBarcode(svgNode, content, {
                format: barcodeFormat,
                lineColor: fgColor,
                background: bgColor,
                height: barcodeHeight * 0.8,
                fontSize: barcodeTextSize,
                fontOptions: "monospace",
                textMargin: 5,
                xmlns: "http://www.w3.org/2000/svg",
            });
            svgString = svgNode.outerHTML;
        } catch (err: any) {
            console.error(err);
            setBarcodeError(err.message || "Error generating SVG barcode.");
            document.body.removeChild(svgNode);
            return;
        }
        document.body.removeChild(svgNode);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        downloadLink.href = URL.createObjectURL(blob);
    } else if (format === 'svg' && generatorType === 'qr') {
         let svgString = await QRCode.toString(content, {
                type: 'svg',
                errorCorrectionLevel: level,
                color: { dark: fgColor, light: bgColor }
            });
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        downloadLink.href = URL.createObjectURL(blob);
    }
    else {
        if (format === 'svg' && generateCard) {
             toast({
                variant: "destructive",
                title: "Not Supported",
                description: "SVG download is not supported for cards yet.",
            });
            return;
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);
        downloadLink.href = dataUrl;
    }

    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    toast({
      title: "Success",
      description: `Download started for ${fileName}.`,
    });
  }, [toast, generatorType, barcodeFormat, barcodeError, content, level, fgColor, bgColor, barcodeHeight, barcodeTextSize, generateCard]);

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
  
  const handleGeneratorTypeChange = (value: string | undefined) => {
    if (!value) return;
    const newType = value as GeneratorType;
    setGeneratorType(newType);
    if (newType === 'qr') {
        setContent('https://firebase.google.com');
    } else if (newType === 'barcode') {
        handleBarcodeFormatChange(barcodeFormat, true);
    }
  }

  const handleBarcodeFormatChange = (value: BarcodeFormat, forceContent?: boolean) => {
    setBarcodeFormat(value);
    if (forceContent || generatorType === 'barcode') {
        switch (value) {
            case 'CODE128':
            case 'CODE128B':
                setContent('Example 1234');
                break;
            case 'CODE128A':
                setContent('EXAMPLE');
                break;
            case 'CODE128C':
                setContent('12345678');
                break;
            case 'EAN13':
                setContent('1234567890128');
                break;
            case 'EAN8':
                setContent('12345670');
                break;
            case 'EAN5':
                setContent('12345');
                break;
            case 'EAN2':
                setContent('12');
                break;
            case 'UPC':
                setContent('123456789012');
                break;
            case 'UPCE':
                setContent('0123456');
                break;
            case 'CODE39':
                setContent('CODE39 EXAMPLE');
                break;
            case 'ITF14':
                setContent('12345678901231');
                break;
            case 'ITF':
                setContent('123456');
                break;
            case 'MSI':
            case 'MSI10':
            case 'MSI11':
            case 'MSI1010':
            case 'MSI1110':
                setContent('123456789');
                break;
            case 'pharmacode':
                setContent('1337');
                break;
            case 'codabar':
                setContent('A12345B');
                break;
            default:
                setContent('Example');
                break;
        }
    }
  }

  return (
    <Card className="w-full max-w-4xl shadow-2xl">
      <CardHeader className="text-center p-4">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full p-2 w-fit mb-2">
            <QrCode className="h-5 w-5" />
        </div>
        <CardTitle className="text-lg font-headline">QRick</CardTitle>
        <CardDescription className="text-xs">
          Generate and customize your barcodes and QR codes in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-[340px_1fr] p-4">
        <div className="grid gap-4">
          <Tabs defaultValue="qr" value={generatorType} onValueChange={handleGeneratorTypeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr"><QrCode className="mr-2"/>QR Code</TabsTrigger>
                <TabsTrigger value="barcode"><Barcode className="mr-2"/>Barcode</TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="pt-4">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="qr-content">Content</Label>
                        <Input
                        id="qr-content"
                        placeholder="Enter URL or text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="text-sm"
                        />
                    </div>
                    <Tabs defaultValue="style">
                        <TabsList>
                            <TabsTrigger value="style"><Palette className="mr-2"/>Style</TabsTrigger>
                        </TabsList>
                        <TabsContent value="style" className="pt-4">
                            <ScrollArea className="h-96">
                                <div className="grid gap-4 pr-4">
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
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </TabsContent>
            
            <TabsContent value="barcode" className="pt-4">
              <ScrollArea className="h-[28rem]">
                <div className="grid gap-4 pr-4">
                  <div className="grid gap-2">
                      <Label htmlFor="format">Format</Label>
                      <Select
                          value={barcodeFormat}
                          onValueChange={(v) => handleBarcodeFormatChange(v as BarcodeFormat, true)}
                      >
                          <SelectTrigger id="format">
                          <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                              <SelectItem value="CODE128">Code 128</SelectItem>
                              <SelectItem value="CODE128A">Code 128A</SelectItem>
                              <SelectItem value="CODE128B">Code 128B</SelectItem>
                              <SelectItem value="CODE128C">Code 128C</SelectItem>
                              <SelectItem value="CODE39">Code 39</SelectItem>
                              <SelectItem value="EAN13">EAN-13</SelectItem>
                              <SelectItem value="EAN8">EAN-8</SelectItem>
                              <SelectItem value="EAN5">EAN-5</SelectItem>
                              <SelectItem value="EAN2">EAN-2</SelectItem>
                              <SelectItem value="UPC">UPC</SelectItem>
                              <SelectItem value="UPCE">UPC-E</SelectItem>
                              <SelectItem value="ITF14">ITF-14</SelectItem>
                              <SelectItem value="ITF">ITF</SelectItem>
                              <SelectItem value="MSI">MSI</SelectItem>
                              <SelectItem value="MSI10">MSI10</SelectItem>
                              <SelectItem value="MSI11">MSI11</SelectItem>
                              <SelectItem value="MSI1010">MSI1010</SelectItem>
                              <SelectItem value="MSI1110">MSI1110</SelectItem>
                              <SelectItem value="pharmacode">Pharmacode</SelectItem>
                              <SelectItem value="codabar">Codabar</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="barcode-content">Content</Label>
                      <Input
                      id="barcode-content"
                      placeholder="Enter barcode content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="text-sm"
                      />
                  </div>
                  <Separator />
                   <div className="flex items-center space-x-2">
                        <Switch id="generate-card" checked={generateCard} onCheckedChange={setGenerateCard} />
                        <Label htmlFor="generate-card" className="flex items-center gap-2 cursor-pointer">
                           <CreditCard className="h-4 w-4" />
                           Generate on Card
                        </Label>
                    </div>
                  <Separator />
                   {generateCard ? (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Card Style</Label>
                            <RadioGroup value={cardDesign} onValueChange={(v) => setCardDesign(v as CardDesign)} className="flex flex-wrap gap-4">
                                <Label htmlFor="card-classic" className="flex items-center gap-2 cursor-pointer text-sm">
                                    <RadioGroupItem value="classic" id="card-classic" />
                                    Classic
                                </Label>
                                <Label htmlFor="card-modern" className="flex items-center gap-2 cursor-pointer text-sm">
                                    <RadioGroupItem value="modern" id="card-modern" />
                                    Modern
                                </Label>
                                 <Label htmlFor="card-sleek" className="flex items-center gap-2 cursor-pointer text-sm">
                                    <RadioGroupItem value="sleek" id="card-sleek" />
                                    Sleek
                                </Label>
                                <Label htmlFor="card-professional" className="flex items-center gap-2 cursor-pointer text-sm">
                                    <RadioGroupItem value="professional" id="card-professional" />
                                    Professional
                                </Label>
                                <Label htmlFor="card-vcard" className="flex items-center gap-2 cursor-pointer text-sm">
                                    <RadioGroupItem value="vcard" id="card-vcard" />
                                    V-Card
                                </Label>
                            </RadioGroup>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="card-title">Title</Label>
                          <Input id="card-title" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="card-subtitle">Subtitle</Label>
                            <Input id="card-subtitle" value={cardSubtitle} onChange={(e) => setCardSubtitle(e.target.value)} />
                        </div>
                        {cardDesign === 'vcard' && (
                             <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="card-email" className="flex items-center gap-2"><Mail className="h-4 w-4"/>Email</Label>
                                    <Input id="card-email" type="email" value={cardEmail} onChange={(e) => setCardEmail(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="card-phone" className="flex items-center gap-2"><Phone className="h-4 w-4"/>Phone</Label>
                                    <Input id="card-phone" type="tel" value={cardPhone} onChange={(e) => setCardPhone(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="card-website" className="flex items-center gap-2"><Globe className="h-4 w-4"/>Website</Label>
                                    <Input id="card-website" type="url" value={cardWebsite} onChange={(e) => setCardWebsite(e.target.value)} />
                                </div>
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label>Colors</Label>
                            <div className="flex items-center flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="card-bg-color" className="text-xs">BG</Label>
                                    <Input id="card-bg-color" type="color" value={cardBgColor} onChange={(e) => setCardBgColor(e.target.value)} className="p-0 h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="card-text-color" className="text-xs">Text</Label>
                                    <Input id="card-text-color" type="color" value={cardTextColor} onChange={(e) => setCardTextColor(e.target.value)} className="p-0 h-6 w-6" />
                                </div>
                                {(cardDesign !== 'classic') && (
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="card-accent-color" className="text-xs">Accent</Label>
                                        <Input id="card-accent-color" type="color" value={cardAccentColor} onChange={(e) => setCardAccentColor(e.target.value)} className="p-0 h-6 w-6" />
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="barcode-fg-color" className="text-xs">Bar</Label>
                                    <Input id="barcode-fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="p-0 h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                   ) : (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Colors</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="barcode-fg-color" className="text-xs">Bar</Label>
                                    <Input id="barcode-fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="p-0 h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="barcode-bg-color" className="text-xs">BG</Label>
                                    <Input id="barcode-bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-0 h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="text-color" className="text-xs">Text</Label>
                                    <Input id="text-color" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="p-0 h-6 w-6" />
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="barcode-height">Height ({barcodeHeight}%)</Label>
                            <Slider id="barcode-height" min={50} max={150} value={[barcodeHeight]} onValueChange={(v) => setBarcodeHeight(v[0])} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="barcode-text-size" className="flex items-center">
                            <CaseSensitive className="mr-2 h-4 w-4"/>
                            Text Size ({barcodeTextSize}px)
                            </Label>
                            <Slider id="barcode-text-size" min={10} max={30} value={[barcodeTextSize]} onValueChange={(v) => setBarcodeTextSize(v[0])} />
                        </div>
                      </div>
                    </div>
                   )}
                  
                </div>
              </ScrollArea>
            </TabsContent>

          </Tabs>
        </div>
        
        <div className="flex justify-center items-center rounded-lg bg-muted p-2">
            <div className="p-2 bg-white rounded-md shadow-inner transition-all duration-300 ease-in-out" aria-label="Preview">
              {content && !barcodeError ? (
                <canvas 
                    ref={canvasRef} 
                    width={generatorType === 'qr' ? size : (generateCard ? 1600 : 1280)} 
                    height={generatorType === 'qr' ? size : (generateCard ? 900 : 320 + (barcodeTextSize * 2.5 / 2))}
                    style={
                        (generatorType === 'barcode' && !generateCard) ? { width: 320, height: 80 + (barcodeTextSize * 2.5 / 2), cursor: 'default' } : 
                        (generateCard ? { width: 400, height: 225, cursor: draggingElement ? 'grabbing' : (hoveredElement ? 'grab' : 'default') } : {width: size, height: size, cursor: 'default'})
                    }
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                />
              ) : (
                <div style={{width: generatorType === 'qr' ? size : 320, height: generatorType === 'qr' ? size : 80 + (barcodeTextSize * 2.5 / 2)}} className="bg-gray-100 flex items-center justify-center text-center text-red-500 rounded-lg p-4">
                    {barcodeError || 'Enter content to generate a code.'}
                </div>
              )}
            </div>
        </div>

      </CardContent>
      <CardFooter className="p-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="w-full text-base py-5" disabled={!content || !!barcodeError}>
                    <Download className="mr-2 h-5 w-5" />
                    Download
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => handleDownload('png')}>PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('jpeg')}>JPEG</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('svg')}>SVG</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );

}
