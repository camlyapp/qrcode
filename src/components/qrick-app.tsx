
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { Download, QrCode, Image as ImageIcon, Palette, Text, X, Waves, Diamond, Shield, GitCommitHorizontal, CircleDot, Barcode, CaseSensitive, PaintBucket, ChevronDown, CreditCard, Mail, Phone, Globe, Heart, Trash2, PlusCircle, FileImage, Share2, Sun, Moon, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, Star, Plus, AlignLeft, AlignCenter, AlignRight, Pilcrow } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";


type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
type QRStyle = "squares" | "dots" | "rounded" | "fluid" | "wavy" | "diamond" | "star" | "cross";
type GradientType = "none" | "linear" | "radial";
type GeneratorType = "qr" | "barcode";
type BarcodeFormat = "CODE128" | "CODE128A" | "CODE128B" | "CODE128C" | "EAN13" | "EAN8" | "EAN5" | "EAN2" | "UPC" | "UPCE" | "CODE39" | "ITF14" | "ITF" | "MSI" | "MSI10" | "MSI11" | "MSI1010" | "MSI1110" | "pharmacode" | "codabar";
type CardDesign = "classic" | "modern" | "sleek" | "professional" | "vcard" | "marriage";
type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br';
type BarcodeTextPosition = 'top' | 'bottom';
type QrTextPosition = "top" | "bottom" | "left" | "right";

interface CardElement {
    id: string;
    type: 'text' | 'barcode' | 'image';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    font?: string;
    fontSize?: number;
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
  const [showBarcodeText, setShowBarcodeText] = useState<boolean>(true);
  const [barcodeTextPosition, setBarcodeTextPosition] = useState<BarcodeTextPosition>('bottom');
  const [qrText, setQrText] = useState<string>("");
  const [qrTextColor, setQrTextColor] = useState<string>("#000000");
  const [qrTextPosition, setQrTextPosition] = useState<QrTextPosition>("bottom");
  const [qrTextSize, setQrTextSize] = useState<number>(20);
  const [qrTextAlign, setQrTextAlign] = useState<CanvasTextAlign>("center");
  const [qrTextMargin, setQrTextMargin] = useState<number>(12);
  const [qrTextVertical, setQrTextVertical] = useState<boolean>(false);


  // Card states
  const [generateCard, setGenerateCard] = useState<boolean>(false);
  const [cardBgColor, setCardBgColor] = useState<string>("#FDFBF7");
  const [cardTextColor, setCardTextColor] = useState<string>("#5C3A21");
  const [cardDesign, setCardDesign] = useState<CardDesign>("classic");
  const [cardAccentColor, setCardAccentColor] = useState<string>("#E0A97E");
  const [cardElements, setCardElements] = useState<CardElement[]>([]);
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [resizingState, setResizingState] = useState<{ elementId: string, handle: ResizeHandle } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [cursorStyle, setCursorStyle] = useState('default');
  const [cardBgImageUrl, setCardBgImageUrl] = useState<string>('');


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const cardBgInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const drawQR = useCallback(() => {
    setBarcodeError(null);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Calculate text dimensions
    const hasText = qrText.trim() !== "";
    let textWidth = 0;
    let textHeight = 0;

    if (hasText) {
        ctx.font = `${qrTextSize}px sans-serif`;
        const metrics = ctx.measureText(qrText);
        textWidth = metrics.width;
        textHeight = qrTextSize;
    }
    
    let canvasWidth = size;
    let canvasHeight = size;
    let qrX = 0;
    let qrY = 0;
    const margin = 8;
    const qrWithMarginSize = size - margin * 2;

    if (hasText) {
      if (qrTextVertical) {
        if (qrTextPosition === 'left' || qrTextPosition === 'right') {
          canvasWidth += textHeight + qrTextMargin;
          qrX = qrTextPosition === 'left' ? textHeight + qrTextMargin : 0;
        }
      } else {
        if (qrTextPosition === 'top' || qrTextPosition === 'bottom') {
          canvasHeight += textHeight + qrTextMargin;
          qrY = qrTextPosition === 'top' ? textHeight + qrTextMargin : 0;
        } else { // left or right
          canvasWidth += textWidth + qrTextMargin;
          qrX = qrTextPosition === 'left' ? textWidth + qrTextMargin : 0;
        }
      }
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Fill background for the entire canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw text
    if (hasText) {
        ctx.save();
        ctx.fillStyle = qrTextColor;
        ctx.font = `${qrTextSize}px sans-serif`;
        
        if (qrTextVertical) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            let textX = 0;
            if (qrTextPosition === 'left') {
                textX = textHeight / 2;
            } else { // right
                textX = canvasWidth - (textHeight / 2);
            }
            const textY = canvasHeight / 2;
            
            ctx.translate(textX, textY);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(qrText, 0, 0);

        } else {
            ctx.textBaseline = "middle";
            ctx.textAlign = qrTextAlign;
            let textX = 0;
            let textY = 0;

            switch (qrTextPosition) {
                case 'top':
                    textY = textHeight / 2;
                    textX = qrTextAlign === 'center' ? canvasWidth / 2 : (qrTextAlign === 'left' ? 0 : canvasWidth);
                    break;
                case 'bottom':
                    textY = size + qrTextMargin + textHeight / 2;
                    textX = qrTextAlign === 'center' ? canvasWidth / 2 : (qrTextAlign === 'left' ? 0 : canvasWidth);
                    break;
                case 'left':
                    textX = textWidth / 2;
                    textY = canvasHeight / 2;
                    break;
                case 'right':
                    textX = size + qrTextMargin + textWidth / 2;
                    textY = canvasHeight / 2;
                    break;
            }
            ctx.fillText(qrText, textX, textY);
        }

        ctx.restore();
    }
    
    QRCode.toDataURL(content, {
        errorCorrectionLevel: level,
        width: qrWithMarginSize,
        margin: 1, 
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    })
    .then(() => {
        const qrCode = QRCode.create(content, { errorCorrectionLevel: level });
        const moduleCount = qrCode.modules.size;
        const moduleSize = qrWithMarginSize / moduleCount;

        ctx.save();
        ctx.translate(qrX + margin, qrY + margin); // Apply margin and text offset

        if (gradientType !== 'none') {
            let gradient: CanvasGradient;
            if (gradientType === 'linear') {
                gradient = ctx.createLinearGradient(0, 0, qrWithMarginSize, qrWithMarginSize);
            } else { // radial
                gradient = ctx.createRadialGradient(qrWithMarginSize / 2, qrWithMarginSize / 2, 0, qrWithMarginSize / 2, qrWithMarginSize / 2, qrWithMarginSize / 2);
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
                    } else if (qrStyle === 'star') {
                        ctx.beginPath();
                        const centerX = moduleX + moduleSize / 2;
                        const centerY = moduleY + moduleSize / 2;
                        const outerRadius = moduleSize / 2;
                        const innerRadius = moduleSize / 4;
                        for (let i = 0; i < 10; i++) {
                            const radius = i % 2 === 0 ? outerRadius : innerRadius;
                            const angle = (i * Math.PI) / 5 - Math.PI / 2;
                            const x = centerX + radius * Math.cos(angle);
                            const y = centerY + radius * Math.sin(angle);
                            if (i === 0) {
                                ctx.moveTo(x, y);
                            } else {
                                ctx.lineTo(x, y);
                            }
                        }
                        ctx.closePath();
                        ctx.fill();
                    } else if (qrStyle === 'cross') {
                        const armSize = moduleSize / 3;
                        ctx.fillRect(moduleX + armSize, moduleY, armSize, moduleSize);
                        ctx.fillRect(moduleX, moduleY + armSize, moduleSize, armSize);
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
        
        ctx.restore(); // Restore context to pre-translation state

        if (imageUrl) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imageUrl;
            img.onload = () => {
                const imgX = qrX + (size - imageSize) / 2;
                const imgY = qrY + (size - imageSize) / 2;
                
                if (excavate) {
                    ctx.save();
                    ctx.clearRect(imgX, imgY, imageSize, imageSize);
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(imgX, imgY, imageSize, imageSize);
                    ctx.restore();
                }
                ctx.drawImage(img, imgX, imgY, imageSize, imageSize);
            };
        }
    })
    .catch(err => {
        setBarcodeError("Error generating QR code. The content may be too long for the selected error correction level.");
        console.error(err);
    });
  }, [content, size, level, fgColor, bgColor, qrStyle, imageUrl, imageSize, excavate, useShieldCorners, gradientType, gradientStartColor, gradientEndColor, qrText, qrTextColor, qrTextPosition, qrTextSize, qrTextAlign, qrTextMargin, qrTextVertical]);

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

            const drawBackground = () => {
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
                    case 'marriage': {
                        // Example decorative background
                        ctx.strokeStyle = cardAccentColor;
                        ctx.lineWidth = 1 * scale;
                        for (let i = 0; i < 20; i++) {
                            ctx.beginPath();
                            ctx.arc(
                                Math.random() * canvas.width,
                                Math.random() * canvas.height,
                                Math.random() * 20 * scale,
                                0, 2 * Math.PI
                            );
                            ctx.stroke();
                        }
                        break;
                    }
                }
            };
            
            const renderElements = () => {
                // Draw elements
                cardElements.forEach(element => {
                    const elImg = new Image();
                    elImg.crossOrigin = "anonymous";
                    if (element.type === 'image') {
                        elImg.src = element.content;
                        elImg.onload = () => {
                           ctx.drawImage(elImg, element.x, element.y, element.width, element.height);
                        };
                         ctx.drawImage(elImg, element.x, element.y, element.width, element.height);
                    } else if (element.type === 'text' && element.content) {
                        const font = element.font || 'sans-serif';
                        const fontSize = element.fontSize || 16;
                        ctx.fillStyle = element.color || cardTextColor;
                        ctx.font = `bold ${fontSize}px ${font}`;
                        ctx.textAlign = element.align || 'left';

                        const lines = element.content.split('\n');
                        lines.forEach((line, i) => {
                            ctx.fillText(line, element.x, element.y + (i * fontSize));
                        });

                    } else if (element.type === 'barcode') {
                        try {
                            const tempCanvas = document.createElement('canvas');
                            let isValid = true;
                            // Generate barcode at high resolution for quality
                            const barcodeScale = 8;
                            JsBarcode(tempCanvas, element.content, {
                                format: barcodeFormat,
                                lineColor: fgColor,
                                background: 'rgba(0,0,0,0)',
                                width: 2 * barcodeScale,
                                height: 40 * barcodeScale,
                                displayValue: false,
                                valid: (valid: boolean) => { isValid = valid; }
                            });
                            
                            if (!isValid) {
                                setBarcodeError("Invalid barcode content for card.");
                                return;
                            }
                             const barcodeTop = barcodeTextPosition === 'top' && showBarcodeText ? (barcodeTextSize * scale) + 5 : 0;
                            ctx.drawImage(tempCanvas, element.x, element.y + barcodeTop, element.width, element.height);
                            
                            if (showBarcodeText) {
                                // Draw barcode text separately if needed
                                ctx.font = `${barcodeTextSize * scale}px monospace`;
                                ctx.fillStyle = textColor;
                                ctx.textAlign = 'center';

                                const textY = barcodeTextPosition === 'top'
                                    ? element.y + (barcodeTextSize * scale) - 5
                                    : element.y + element.height + (barcodeTextSize * scale) + 5;
                                
                                ctx.fillText(element.content, element.x + element.width / 2, textY);
                            }

                        } catch (err: any) {
                            setBarcodeError(err.message || "Error generating barcode for card.");
                        }
                    }
                });
                
                // Draw selection box and handles
                const selected = cardElements.find(el => el.id === selectedElement);
                if (selected) {
                    ctx.strokeStyle = 'rgba(0, 123, 255, 0.7)';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(selected.x, selected.y, selected.width, selected.height);

                    const handleSize = 8;
                    const handles = {
                        tl: { x: selected.x - handleSize / 2, y: selected.y - handleSize / 2 },
                        tr: { x: selected.x + selected.width - handleSize / 2, y: selected.y - handleSize / 2 },
                        bl: { x: selected.x - handleSize / 2, y: selected.y + selected.height - handleSize / 2 },
                        br: { x: selected.x + selected.width - handleSize / 2, y: selected.y + selected.height - handleSize / 2 },
                    };

                    ctx.fillStyle = 'rgba(0, 123, 255, 0.9)';
                    Object.values(handles).forEach(handle => {
                        ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
                    });
                }
            };
            
            if (cardBgImageUrl) {
                const bgImg = new Image();
                bgImg.crossOrigin = "anonymous";
                bgImg.src = cardBgImageUrl;
                bgImg.onload = () => {
                    const pattern = ctx.createPattern(bgImg, 'repeat');
                    if (pattern) {
                        ctx.fillStyle = pattern;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    renderElements();
                };
                 const pattern = ctx.createPattern(bgImg, 'repeat');
                 if (pattern) {
                    ctx.fillStyle = pattern;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                 }
            } else {
                drawBackground();
            }

            renderElements();

        } else {
            // Barcode-only Drawing Logic
            const displayWidth = 320;
            const displayHeight = 80;
            const scale = 4;
            
            canvas.width = displayWidth * scale;
            const textHeight = showBarcodeText ? (barcodeTextSize * 2.5) * scale / 2 : 0;
            const canvasHeight = (displayHeight * scale) + textHeight;
            canvas.height = canvasHeight;
            
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
                const barcodeTop = barcodeTextPosition === 'top' && showBarcodeText ? textHeight : 0;

                if (ctx) {
                    ctx.drawImage(tempCanvas, (canvas.width - barcodeWidth) / 2, barcodeTop, barcodeWidth, barcodeHeightCalculated);
                    if (showBarcodeText) {
                        ctx.font = `${barcodeTextSize * scale}px monospace`;
                        ctx.fillStyle = textColor;
                        ctx.textAlign = 'center';
                        const textY = barcodeTextPosition === 'top' ? (barcodeTextSize * scale) : barcodeHeightCalculated + (barcodeTextSize * scale);
                        ctx.fillText(content, canvas.width / 2, textY);
                    }
                }

            } catch (err: any) {
                setBarcodeError(err.message || "Error generating barcode.");
                const ctx = canvas?.getContext("2d");
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        }
    }, [content, barcodeFormat, fgColor, bgColor, barcodeHeight, barcodeTextSize, textColor, showBarcodeText, generateCard, cardBgColor, cardTextColor, cardDesign, cardAccentColor, cardElements, selectedElement, cardBgImageUrl, barcodeTextPosition]);

  const getTextMetrics = (text: string, font: string, fontSize: number, ctx: CanvasRenderingContext2D) => {
    ctx.font = `bold ${fontSize}px ${font}`;
    const metrics = ctx.measureText(text);
    let height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    if (isNaN(height) || height === 0) {
        // Fallback for browsers that don't support these properties or return 0
        height = fontSize * 1.2;
    }
    const lines = text.split('\n').length;
    return {
        width: metrics.width,
        height: height * lines
    };
  };

  // Initialize card elements based on design
  useEffect(() => {
    if (!generateCard) return;

    const scale = 4;
    const canvasWidth = 400 * scale;
    const canvasHeight = 225 * scale;
    const ctx = canvasRef.current?.getContext('2d');
    
    if(!ctx) return;

    const newElements: CardElement[] = [];

    // Common barcode properties
    const tempCanvas = document.createElement('canvas');
    try {
      const barcodeScale = 8;
      JsBarcode(tempCanvas, content, { format: barcodeFormat, displayValue: false, width: 2 * barcodeScale, height: 40 * barcodeScale });
    } catch(e) { console.error("barcode error"); }
    const barcodeWidth = tempCanvas.width || 200 * scale;
    const barcodeHeightVal = tempCanvas.height || 40 * scale;

    
    let defaultTitle = 'John Doe';
    let defaultSubtitle = 'Software Engineer';
    let defaultEmail = 'john.doe@example.com';
    let defaultPhone = '+1 (123) 456-7890';
    let defaultWebsite = 'example.com';

    if(cardDesign === 'marriage') {
        defaultTitle = 'John & Jane';
        defaultSubtitle = 'December 31, 2024';
    } 

    const textElements: { [key: string]: Omit<CardElement, 'id' | 'type' | 'width' | 'height'> } = {
        title: { content: defaultTitle, font: `sans-serif`, fontSize: 24 * scale, align: 'center', color: cardTextColor },
        subtitle: { content: defaultSubtitle, font: `sans-serif`, fontSize: 16 * scale, align: 'center', color: cardTextColor },
        email: { content: defaultEmail, font: `sans-serif`, fontSize: 14 * scale, align: 'left', color: cardTextColor },
        phone: { content: defaultPhone, font: `sans-serif`, fontSize: 14 * scale, align: 'left', color: cardTextColor },
        website: { content: defaultWebsite, font: `sans-serif`, fontSize: 14 * scale, align: 'left', color: cardTextColor },
    };
    
    // Position elements based on design
    switch (cardDesign) {
        case 'classic': {
            const titleMetrics = getTextMetrics(textElements.title.content!, textElements.title.font!, textElements.title.fontSize!, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, textElements.subtitle.font!, textElements.subtitle.fontSize!, ctx);
            newElements.push({ id: 'title', type: 'text', ...textElements.title, x: (canvasWidth - titleMetrics.width) / 2, y: 50 * scale, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, x: (canvasWidth - subtitleMetrics.width) / 2, y: 80 * scale, ...subtitleMetrics });
            newElements.push({ id: 'barcode', type: 'barcode', content: content, x: (canvasWidth - barcodeWidth) / 2, y: 120 * scale, width: barcodeWidth, height: barcodeHeightVal });
            break;
        }
        case 'modern': {
            const accentWidth = 100 * scale;
            const titleMetrics = getTextMetrics(textElements.title.content!, textElements.title.font!, 22 * scale, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, textElements.subtitle.font!, 14 * scale, ctx);
            newElements.push({ id: 'title', type: 'text', ...textElements.title, fontSize: 22 * scale, align: 'left', x: accentWidth + 20 * scale, y: 60 * scale, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, fontSize: 14 * scale, align: 'left', x: accentWidth + 20 * scale, y: 90 * scale, ...subtitleMetrics });
            newElements.push({ id: 'barcode', type: 'barcode', content: content, x: (canvasWidth - barcodeWidth + accentWidth) / 2, y: 120 * scale, width: barcodeWidth, height: barcodeHeightVal });
            break;
        }
        case 'sleek': {
            const titleMetrics = getTextMetrics(textElements.title.content!, textElements.title.font!, 20 * scale, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, textElements.subtitle.font!, 14 * scale, ctx);
            newElements.push({ id: 'title', type: 'text', ...textElements.title, fontSize: 20 * scale, color: cardBgColor, align: 'left', x: 20 * scale, y: 40 * scale, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, fontSize: 14 * scale, align: 'left', x: 20 * scale, y: (60 * scale) + 30 * scale, ...subtitleMetrics });
            newElements.push({ id: 'barcode', type: 'barcode', content: content, x: (canvasWidth - barcodeWidth) / 2, y: 110 * scale, width: barcodeWidth, height: barcodeHeightVal });
            break;
        }
        case 'professional': {
            const titleMetrics = getTextMetrics(textElements.title.content!, textElements.title.font!, 22 * scale, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, textElements.subtitle.font!, 14 * scale, ctx);
            newElements.push({ id: 'title', type: 'text', ...textElements.title, fontSize: 22 * scale, x: (canvasWidth - titleMetrics.width) / 2, y: 50 * scale, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, fontSize: 14 * scale, x: (canvasWidth - subtitleMetrics.width) / 2, y: 75 * scale, ...subtitleMetrics });
            newElements.push({ id: 'barcode', type: 'barcode', content: content, x: (canvasWidth - barcodeWidth) / 2, y: 115 * scale, width: barcodeWidth, height: barcodeHeightVal });
            break;
        }
        case 'vcard': {
            const titleMetrics = getTextMetrics(textElements.title.content!, textElements.title.font!, 20 * scale, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, textElements.subtitle.font!, 12 * scale, ctx);
            const emailMetrics = getTextMetrics(defaultEmail, textElements.email.font!, textElements.email.fontSize!, ctx);
            const phoneMetrics = getTextMetrics(defaultPhone, textElements.phone.font!, textElements.phone.fontSize!, ctx);
            const websiteMetrics = getTextMetrics(defaultWebsite, textElements.website.font!, textElements.website.fontSize!, ctx);

            newElements.push({ id: 'title', type: 'text', ...textElements.title, fontSize: 20 * scale, color: cardBgColor, align: 'left', x: 20 * scale, y: 30 * scale, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, fontSize: 12 * scale, font: 'italic sans-serif', color: cardBgColor, align: 'left', x: 20 * scale, y: 50 * scale, ...subtitleMetrics });
            const infoStartY = 80 * scale;
            const infoSpacing = 25 * scale;
            newElements.push({ id: 'email', type: 'text', ...textElements.email, x: 40 * scale, y: infoStartY, ...emailMetrics });
            newElements.push({ id: 'phone', type: 'text', ...textElements.phone, x: 40 * scale, y: infoStartY + infoSpacing, ...phoneMetrics });
            newElements.push({ id: 'website', type: 'text', ...textElements.website, x: 40 * scale, y: infoStartY + infoSpacing * 2, ...websiteMetrics });
            newElements.push({ id: 'barcode', type: 'barcode', content: content, x: canvasWidth - barcodeWidth - 20 * scale, y: 155 * scale, width: barcodeWidth, height: barcodeHeightVal });
            break;
        }
         case 'marriage': {
            const titleFont = `'Great Vibes', cursive`;
            const subtitleFont = `italic sans-serif`;

            const titleMetrics = getTextMetrics(textElements.title.content!, titleFont, 36 * scale, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, subtitleFont, 16 * scale, ctx);
            
            newElements.push({ id: 'title', type: 'text', ...textElements.title, font: titleFont, fontSize: 36 * scale, x: (canvasWidth - titleMetrics.width) / 2, y: 80 * scale, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, font: subtitleFont, fontSize: 16 * scale, x: (canvasWidth - subtitleMetrics.width) / 2, y: 120 * scale, ...subtitleMetrics });
            newElements.push({ id: 'barcode', type: 'barcode', content: content, x: (canvasWidth - barcodeWidth) / 2, y: 155 * scale, width: barcodeWidth, height: barcodeHeightVal });
            break;
        }
    }
    setCardElements(newElements);
    setSelectedElement(null);
}, [generateCard, cardDesign, content, barcodeFormat, fgColor, cardTextColor, cardBgColor]);


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
  }, [drawQR, drawBarcodeOrCard, content, size, generatorType, fgColor, bgColor, textColor, barcodeHeight, barcodeTextSize, level, qrStyle, imageUrl, imageSize, excavate, useShieldCorners, gradientType, gradientStartColor, gradientEndColor, generateCard, cardElements, selectedElement, showBarcodeText, barcodeTextPosition, qrText, qrTextColor, qrTextPosition, qrTextSize, qrTextAlign, qrTextMargin, qrTextVertical]);

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

    const getResizeHandle = (pos: {x: number, y: number}, element: CardElement): ResizeHandle | null => {
        const handleSize = 10;
        if (pos.x >= element.x - handleSize && pos.x <= element.x + handleSize &&
            pos.y >= element.y - handleSize && pos.y <= element.y + handleSize) return 'tl';
        if (pos.x >= element.x + element.width - handleSize && pos.x <= element.x + element.width + handleSize &&
            pos.y >= element.y - handleSize && pos.y <= element.y + handleSize) return 'tr';
        if (pos.x >= element.x - handleSize && pos.x <= element.x + handleSize &&
            pos.y >= element.y + element.height - handleSize && pos.y <= element.y + element.height + handleSize) return 'bl';
        if (pos.x >= element.x + element.width - handleSize && pos.x <= element.x + element.width + handleSize &&
            pos.y >= element.y + element.height - handleSize && pos.y <= element.y + element.height + handleSize) return 'br';
        return null;
    };

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (!generateCard) return;
        e.preventDefault();
        const pos = getPointerPosition(e);
        
        if (selectedElement) {
            const element = cardElements.find(el => el.id === selectedElement);
            if(element) {
                const handle = getResizeHandle(pos, element);
                if (handle) {
                    setResizingState({ elementId: selectedElement, handle });
                    return;
                }
            }
        }

        const clickedElement = [...cardElements].reverse().find(el => 
            pos.x >= el.x && pos.x <= el.x + el.width &&
            pos.y >= el.y && pos.y <= el.y + el.height
        );

        if (clickedElement) {
            setSelectedElement(clickedElement.id);
            setDraggingElement(clickedElement.id);
            setDragOffset({ x: pos.x - clickedElement.x, y: pos.y - clickedElement.y });
        } else {
            setSelectedElement(null);
        }
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        const pos = getPointerPosition(e);
        e.preventDefault();
        
        if (resizingState) {
            setCardElements(prev => prev.map(el => {
                if (el.id === resizingState.elementId) {
                    let { x, y, width, height } = el;
                    const originalX = el.x;
                    const originalY = el.y;
                    const originalWidth = el.width;
                    const originalHeight = el.height;

                    switch (resizingState.handle) {
                        case 'tl':
                            width = originalX + originalWidth - pos.x;
                            height = originalY + originalHeight - pos.y;
                            x = pos.x;
                            y = pos.y;
                            break;
                        case 'tr':
                            width = pos.x - originalX;
                            height = originalY + originalHeight - pos.y;
                            y = pos.y;
                            break;
                        case 'bl':
                            width = originalX + originalWidth - pos.x;
                            height = pos.y - originalY;
                            x = pos.x;
                            break;
                        case 'br':
                            width = pos.x - originalX;
                            height = pos.y - originalY;
                            break;
                    }
                    const newWidth = Math.max(width, 20);
                    const newHeight = Math.max(height, 20);
                    
                    if (el.type === 'text') {
                        const aspectRatio = el.width / (el.fontSize || 16);
                        const newFontSize = newWidth / aspectRatio;
                        return { ...el, x, y, width: newWidth, height: newHeight, fontSize: newFontSize };
                    }

                    return { ...el, x, y, width: newWidth, height: newHeight };
                }
                return el;
            }));
        } else if (draggingElement) {
            setCardElements(prev => prev.map(el =>
                el.id === draggingElement
                    ? { ...el, x: pos.x - dragOffset.x, y: pos.y - dragOffset.y }
                    : el
            ));
        } else if (generateCard) {
            const currentSelected = cardElements.find(el => el.id === selectedElement);
            let handleCursor = 'default';
            if (currentSelected) {
                const handle = getResizeHandle(pos, currentSelected);
                if (handle === 'tl' || handle === 'br') handleCursor = 'nwse-resize';
                else if (handle === 'tr' || handle === 'bl') handleCursor = 'nesw-resize';
            }
             if (handleCursor === 'default') {
                const currentHoveredElement = [...cardElements].reverse().find(el => 
                    pos.x >= el.x && pos.x <= el.x + el.width &&
                    pos.y >= el.y && pos.y <= el.y + el.height
                );
                setHoveredElement(currentHoveredElement?.id || null);
                handleCursor = currentHoveredElement ? 'grab' : 'default';
            }
             setCursorStyle(handleCursor);
        }
    };

    const handleMouseUp = () => {
        setDraggingElement(null);
        setResizingState(null);
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
                fontSize: showBarcodeText ? barcodeTextSize : 0,
                textPosition: barcodeTextPosition,
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
  }, [toast, generatorType, barcodeFormat, barcodeError, content, level, fgColor, bgColor, barcodeHeight, barcodeTextSize, generateCard, showBarcodeText, barcodeTextPosition]);

  const handleShare = async () => {
    if (!content || barcodeError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: barcodeError || "Could not find code to share.",
      });
      return;
    }
    
    try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `${generatorType}-code.png`, { type: 'image/png' });

        if (navigator.share) {
            await navigator.share({
                title: 'QRick Code',
                text: `Here is my ${generatorType === 'qr' ? 'QR code' : 'barcode'}.`,
                files: [file],
            });
            toast({
                title: "Shared!",
                description: "The code was shared successfully.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Not Supported",
                description: "Web Share API is not supported in your browser.",
            });
        }
    } catch (err) {
        console.error("Share failed:", err);
        toast({
            variant: "destructive",
            title: "Share Failed",
            description: "An error occurred while trying to share.",
        });
    }
  };


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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoUrl = reader.result as string;
        const scale = 4;
        const newLogoElement: CardElement = {
            id: `image-${Date.now()}`,
            type: 'image',
            content: logoUrl,
            x: 50 * scale,
            y: 50 * scale,
            width: 100 * scale,
            height: 100 * scale,
        };
        setCardElements(prev => [...prev, newLogoElement]);
        setSelectedElement(newLogoElement.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCardBgImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardBgImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();
  const triggerLogoSelect = () => logoInputRef.current?.click();
  const triggerCardBgSelect = () => cardBgInputRef.current?.click();

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
        let newContent = '';
        switch (value) {
            case 'CODE128':
            case 'CODE128B':
                newContent = 'Example 1234';
                break;
            case 'CODE128A':
                newContent = 'EXAMPLE';
                break;
            case 'CODE128C':
                newContent = '12345678';
                break;
            case 'EAN13':
                newContent = '1234567890128';
                break;
            case 'EAN8':
                newContent = '12345670';
                break;
            case 'EAN5':
                newContent = '12345';
                break;
            case 'EAN2':
                newContent = '12';
                break;
            case 'UPC':
                newContent = '123456789012';
                break;
            case 'UPCE':
                newContent = '0123456';
                break;
            case 'CODE39':
                newContent = 'CODE39 EXAMPLE';
                break;
            case 'ITF14':
                newContent = '12345678901231';
                break;
            case 'ITF':
                newContent = '123456';
                break;
            case 'MSI':
            case 'MSI10':
            case 'MSI11':
            case 'MSI1010':
            case 'MSI1110':
                newContent = '123456789';
                break;
            case 'pharmacode':
                newContent = '1337';
                break;
            case 'codabar':
                newContent = 'A12345B';
                break;
            default:
                newContent = 'Example';
                break;
        }
        setContent(newContent);
        if (generateCard) {
            setCardElements(prev => prev.map(el => el.type === 'barcode' ? { ...el, content: newContent } : el));
        }
    }
  }

  const addTextElement = () => {
    const scale = 4;
    const newTextElement: CardElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      x: 50 * scale,
      y: 50 * scale,
      width: 150 * scale,
      height: 30 * scale,
      fontSize: 16 * scale,
      color: cardTextColor,
      align: 'left',
      font: 'sans-serif'
    };
    setCardElements(prev => [...prev, newTextElement]);
    setSelectedElement(newTextElement.id);
  };

  const deleteSelectedElement = () => {
    if (selectedElement) {
      setCardElements(prev => prev.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const updateSelectedElement = (prop: keyof CardElement, value: any) => {
    if (!selectedElement) return;

    setCardElements(prev => prev.map(el => 
        el.id === selectedElement ? { ...el, [prop]: value } : el
    ));

    // Recalculate width/height if font size changes
    if (prop === 'fontSize' || prop === 'content') {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            setCardElements(prev => prev.map(el => {
                if (el.id === selectedElement && el.type === 'text') {
                    const updatedElement = { ...el, [prop]: value };
                    const metrics = getTextMetrics(updatedElement.content!, updatedElement.font!, updatedElement.fontSize!, ctx);
                    return { ...updatedElement, width: metrics.width, height: metrics.height };
                }
                return el;
            }));
        }
    }
  };

  const currentSelectedElement = cardElements.find(el => el.id === selectedElement);

  const getCanvasDisplaySize = () => {
    if (generatorType === 'barcode') {
        return generateCard ? { width: 400, height: 225 } : { width: 320, height: (showBarcodeText ? 80 + (barcodeTextSize * 2.5) : 80) };
    }
    // QR Code
    const hasText = qrText.trim() !== "";
    let displayWidth = size;
    let displayHeight = size;
    if (hasText) {
        const ctx = canvasRef.current?.getContext("2d");
        if(ctx) {
            ctx.font = `${qrTextSize}px sans-serif`;
            const metrics = ctx.measureText(qrText);
            const textWidth = metrics.width;
            const textHeight = qrTextSize;
             if (qrTextVertical) {
              if (qrTextPosition === 'left' || qrTextPosition === 'right') {
                displayWidth += textHeight + qrTextMargin;
              }
            } else {
              if (qrTextPosition === 'top' || qrTextPosition === 'bottom') {
                  displayHeight += textHeight + qrTextMargin;
              } else {
                  displayWidth += textWidth + qrTextMargin;
              }
            }
        }
    }
    return { width: displayWidth, height: displayHeight };
  }

  const handleTextPositionChange = (value: QrTextPosition) => {
    setQrTextPosition(value);
    if (value === 'top' || value === 'bottom') {
      setQrTextVertical(false);
    }
  }

  const handleVerticalTextToggle = (checked: boolean) => {
    setQrTextVertical(checked);
    if (checked) {
      if (qrTextPosition === 'top' || qrTextPosition === 'bottom') {
        setQrTextPosition('left');
      }
    }
  }

  return (
    <Card className="w-full max-w-4xl shadow-2xl">
      <CardContent className="grid gap-4 md:grid-cols-[340px_1fr] p-4 pt-6">
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
                            <TabsTrigger value="text"><Text className="mr-2"/>Text</TabsTrigger>
                        </TabsList>
                        <TabsContent value="style" className="pt-4">
                            <ScrollArea className="h-96">
                                <div className="grid gap-4 pr-4">
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="size">Size ({size}px)</Label>
                                            <Slider id="size" min={64} max={1024} step={32} value={[size]} onValueChange={(v) => setSize(v[0])} />
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
                                        <Label htmlFor="qr-style">Module Style</Label>
                                        <Select
                                            value={qrStyle}
                                            onValueChange={(value: QRStyle) => setQrStyle(value)}
                                        >
                                            <SelectTrigger id="qr-style">
                                                <SelectValue placeholder="Select style" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="squares">Squares</SelectItem>
                                                <SelectItem value="dots">Dots</SelectItem>
                                                <SelectItem value="rounded">Rounded</SelectItem>
                                                <SelectItem value="fluid">Fluid</SelectItem>
                                                <SelectItem value="wavy">Wavy</SelectItem>
                                                <SelectItem value="diamond">Diamond</SelectItem>
                                                <SelectItem value="star">Star</SelectItem>
                                                <SelectItem value="cross">Cross</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                                <Input id="fg-color" type="color" value={fgColor} onChange={(e) => { setFgColor(e.target.value); setGradientType("none"); }} className="p-0 h-8 w-8 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="bg-color">Background</Label>
                                            <div className="relative">
                                                <Input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-0 h-8 w-8 rounded-full" />
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
                        <TabsContent value="text" className="pt-4">
                            <ScrollArea className="h-96">
                                <div className="grid gap-4 pr-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="qr-text">Text</Label>
                                        <Input id="qr-text" placeholder="Enter text" value={qrText} onChange={(e) => setQrText(e.target.value)} />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="vertical-text" checked={qrTextVertical} onCheckedChange={handleVerticalTextToggle} />
                                        <Label htmlFor="vertical-text" className="flex items-center gap-2 cursor-pointer">
                                            <Pilcrow className="h-4 w-4 -rotate-90" />
                                            Vertical Text
                                        </Label>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Position</Label>
                                        <Select value={qrTextPosition} onValueChange={(v) => handleTextPositionChange(v as QrTextPosition)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select position" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="top" disabled={qrTextVertical}>Top</SelectItem>
                                                <SelectItem value="bottom" disabled={qrTextVertical}>Bottom</SelectItem>
                                                <SelectItem value="left">Left</SelectItem>
                                                <SelectItem value="right">Right</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Align</Label>
                                        <RadioGroup value={qrTextAlign} onValueChange={(v) => setQrTextAlign(v as CanvasTextAlign)} className="flex gap-2">
                                            <Label htmlFor="align-left" className="p-2 border rounded-md cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground">
                                                <RadioGroupItem value="left" id="align-left" className="sr-only"/>
                                                <AlignLeft className="h-5 w-5"/>
                                            </Label>
                                            <Label htmlFor="align-center" className="p-2 border rounded-md cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground">
                                                <RadioGroupItem value="center" id="align-center" className="sr-only"/>
                                                <AlignCenter className="h-5 w-5"/>
                                            </Label>
                                            <Label htmlFor="align-right" className="p-2 border rounded-md cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground">
                                                <RadioGroupItem value="right" id="align-right" className="sr-only"/>
                                                <AlignRight className="h-5 w-5"/>
                                            </Label>
                                        </RadioGroup>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="qr-text-color">Color</Label>
                                            <Input id="qr-text-color" type="color" value={qrTextColor} onChange={(e) => setQrTextColor(e.target.value)} className="p-1 h-9" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="qr-text-size">Font Size ({qrTextSize}px)</Label>
                                            <Slider id="qr-text-size" min={8} max={48} step={1} value={[qrTextSize]} onValueChange={(v) => setQrTextSize(v[0])} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="qr-text-margin">Margin ({qrTextMargin}px)</Label>
                                        <Slider id="qr-text-margin" min={0} max={40} step={1} value={[qrTextMargin]} onValueChange={(v) => setQrTextMargin(v[0])} />
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
                  <div className="grid grid-cols-2 gap-4">
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
                                 <Label htmlFor="card-marriage" className="flex items-center gap-2 cursor-pointer text-sm">
                                    <RadioGroupItem value="marriage" id="card-marriage" />
                                    <Heart className="h-4 w-4"/>
                                    Marriage
                                </Label>
                            </RadioGroup>
                        </div>
                       
                        <div className="grid gap-2">
                            <Label>Colors</Label>
                            <div className="flex items-center flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="card-bg-color" className="text-xs">BG</Label>
                                    <Input id="card-bg-color" type="color" value={cardBgColor} onChange={(e) => setCardBgColor(e.target.value)} className="p-0 h-6 w-6 rounded-full" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="card-text-color" className="text-xs">Text</Label>
                                    <Input id="card-text-color" type="color" value={cardTextColor} onChange={(e) => setCardTextColor(e.target.value)} className="p-0 h-6 w-6 rounded-full" />
                                </div>
                                {(cardDesign !== 'classic') && (
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="card-accent-color" className="text-xs">Accent</Label>
                                        <Input id="card-accent-color" type="color" value={cardAccentColor} onChange={(e) => setCardAccentColor(e.target.value)} className="p-0 h-6 w-6 rounded-full" />
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="barcode-fg-color" className="text-xs">Bar</Label>
                                    <Input id="barcode-fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="p-0 h-6 w-6 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <Separator />
                        <div className="grid gap-2">
                             <Label>Assets</Label>
                             <div className="flex gap-2">
                                <Input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden"/>
                                <Button onClick={triggerLogoSelect} variant="outline" size="sm" className="flex-1">
                                    <ImageIcon className="mr-2" /> Add Logo
                                </Button>
                                <Input type="file" ref={cardBgInputRef} onChange={handleCardBgImageUpload} accept="image/*" className="hidden"/>
                                <Button onClick={triggerCardBgSelect} variant="outline" size="sm" className="flex-1">
                                    <FileImage className="mr-2" /> Add BG
                                </Button>
                             </div>
                        </div>
                        <Separator />
                        <div className="grid gap-2">
                            <Button onClick={addTextElement} variant="outline" size="sm">
                                <PlusCircle className="mr-2" /> Add Text
                            </Button>
                        </div>
                        
                        {currentSelectedElement && currentSelectedElement.type === 'text' && (
                            <div className="grid gap-4 p-4 border rounded-lg">
                                <div className="flex justify-between items-center">
                                    <Label className="font-bold">Selected Text</Label>
                                    <Button variant="ghost" size="icon" onClick={deleteSelectedElement} className="h-7 w-7">
                                        <Trash2 className="text-red-500" />
                                    </Button>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="selected-text-content">Content</Label>
                                    <Textarea
                                        id="selected-text-content"
                                        value={currentSelectedElement.content}
                                        onChange={(e) => updateSelectedElement('content', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="selected-text-size">Font Size</Label>
                                        <Input
                                            id="selected-text-size"
                                            type="number"
                                            value={currentSelectedElement.fontSize ? Math.round(currentSelectedElement.fontSize / 4) : 16}
                                            onChange={(e) => updateSelectedElement('fontSize', parseInt(e.target.value, 10) * 4)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="selected-text-color">Color</Label>
                                        <Input
                                            id="selected-text-color"
                                            type="color"
                                            value={currentSelectedElement.color}
                                            onChange={(e) => updateSelectedElement('color', e.target.value)}
                                            className="p-1 h-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                         {currentSelectedElement && currentSelectedElement.type !== 'text' && (
                            <div className="grid gap-4 p-4 border rounded-lg">
                                <div className="flex justify-between items-center">
                                    <Label className="font-bold">Selected Element</Label>
                                    <Button variant="ghost" size="icon" onClick={deleteSelectedElement} className="h-7 w-7">
                                        <Trash2 className="text-red-500" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">Move or resize the selected {currentSelectedElement.type} on the canvas.</p>
                                {currentSelectedElement.type === 'barcode' && (
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Switch id="show-barcode-text" checked={showBarcodeText} onCheckedChange={setShowBarcodeText} />
                                        <Label htmlFor="show-barcode-text">Show Text</Label>
                                    </div>
                                )}
                            </div>
                         )}


                    </div>
                   ) : (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Colors</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="barcode-fg-color" className="text-xs">Bar</Label>
                                    <Input id="barcode-fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="p-0 h-6 w-6 rounded-full" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="barcode-bg-color" className="text-xs">BG</Label>
                                    <Input id="barcode-bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-0 h-6 w-6 rounded-full" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="text-color" className="text-xs">Text</Label>
                                    <Input id="text-color" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="p-0 h-6 w-6 rounded-full" />
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
                        <div className="flex items-center space-x-2">
                            <Switch id="show-barcode-text-standalone" checked={showBarcodeText} onCheckedChange={setShowBarcodeText} />
                            <Label htmlFor="show-barcode-text-standalone">Show Text</Label>
                        </div>
                        {showBarcodeText && (
                            <div className="grid gap-2">
                                <Label>Text Position</Label>
                                <RadioGroup value={barcodeTextPosition} onValueChange={(v) => setBarcodeTextPosition(v as BarcodeTextPosition)} className="flex gap-4">
                                    <Label htmlFor="pos-bottom" className="flex items-center gap-2 cursor-pointer text-sm">
                                        <RadioGroupItem value="bottom" id="pos-bottom" />
                                        <AlignVerticalJustifyEnd className="h-4 w-4" /> Bottom
                                    </Label>
                                    <Label htmlFor="pos-top" className="flex items-center gap-2 cursor-pointer text-sm">
                                        <RadioGroupItem value="top" id="pos-top" />
                                        <AlignVerticalJustifyStart className="h-4 w-4" /> Top
                                    </Label>
                                </RadioGroup>
                            </div>
                        )}
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
                    width={getCanvasDisplaySize().width}
                    height={getCanvasDisplaySize().height}
                    style={
                        (generatorType === 'barcode' && !generateCard) ? { width: 320, height: (showBarcodeText ? 80 + (barcodeTextSize * 2.5) : 80), cursor: 'default' } : 
                        (generateCard ? { width: 400, height: 225, cursor: cursorStyle } : { width: getCanvasDisplaySize().width, height: getCanvasDisplaySize().height, maxWidth: 320, cursor: 'default'})
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
      <CardFooter className="p-4 flex justify-between">
        <div />
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" disabled={!content || !!barcodeError}>
                        <Download className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => handleDownload('png')}>PNG</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload('jpeg')}>JPEG</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload('svg')}>SVG</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="outline" size="icon" onClick={handleShare} disabled={!content || !!barcodeError}>
                            <Share2 className="h-5 w-5" />
                         </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Share</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );

}

    
    

    

    

    
