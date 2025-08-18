

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import QRCodeStyling, { type DotType, type CornerSquareType, type CornerDotType } from "qr-code-styling";
import { Download, QrCode, Image as ImageIcon, Palette, Text, X, Waves, Diamond, Shield, GitCommitHorizontal, CircleDot, Barcode, CaseSensitive, PaintBucket, ChevronDown, CreditCard, Mail, Phone, Globe, Heart, Trash2, PlusCircle, FileImage, Share2, Sun, Moon, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, Star, Plus, AlignLeft, AlignCenter, AlignRight, Pilcrow, Edit, ImagePlus, Shapes, Wifi, MessageSquare, MapPin, Calendar, User, VenetianMask, Rss, Instagram, Facebook, Linkedin, Twitter, Youtube, AtSign, Building, Briefcase } from "lucide-react";

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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";


type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
type QRStyle = "squares" | "dots" | "rounded" | "fluid" | "wavy" | "diamond" | "star" | "cross";
type GradientType = "none" | "linear" | "radial";
type GeneratorType = "qr" | "barcode";
type BarcodeFormat = "CODE128" | "CODE128A" | "CODE128B" | "CODE128C" | "EAN13" | "EAN8" | "EAN5" | "EAN2" | "UPC" | "UPCE" | "CODE39" | "ITF14" | "ITF" | "MSI" | "MSI10" | "MSI11" | "MSI1010" | "MSI1110" | "pharmacode" | "codabar";
type CardDesign = "classic" | "modern" | "sleek" | "professional" | "vcard" | "marriage";
type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br';
type BarcodeTextPosition = 'top' | 'bottom';
type QrTextPosition = "top" | "bottom" | "left" | "right";
type QRStylingEngine = "legacy" | "styling";
type QrDataType = 'text' | 'wifi' | 'sms' | 'phone' | 'email' | 'vcard' | 'geolocation' | 'event' | 'whatsapp' | 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok';


interface CardElement {
    id: string;
    type: 'text' | 'barcode' | 'image' | 'qrcode';
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

interface QrTextElement {
    id: string;
    text: string;
    color: string;
    position: QrTextPosition;
    size: number;
    align: CanvasTextAlign;
    margin: number;
    isVertical: boolean;
}

interface QrImageElement {
    id: string;
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
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

const qrDataTypes: { id: QrDataType, label: string, icon: React.ReactNode }[] = [
  { id: 'text', label: 'Text/URL', icon: <Text className="h-5 w-5" /> },
  { id: 'wifi', label: 'Wi-Fi', icon: <Wifi className="h-5 w-5" /> },
  { id: 'sms', label: 'SMS', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'phone', label: 'Phone', icon: <Phone className="h-5 w-5" /> },
  { id: 'email', label: 'Email', icon: <Mail className="h-5 w-5" /> },
  { id: 'vcard', label: 'vCard', icon: <User className="h-5 w-5" /> },
  { id: 'geolocation', label: 'Location', icon: <MapPin className="h-5 w-5" /> },
  { id: 'event', label: 'Event', icon: <Calendar className="h-5 w-5" /> },
  { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'facebook', label: 'Facebook', icon: <Facebook className="h-5 w-5" /> },
  { id: 'twitter', label: 'Twitter/X', icon: <Twitter className="h-5 w-5" /> },
  { id: 'instagram', label: 'Instagram', icon: <Instagram className="h-5 w-5" /> },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-5 w-5" /> },
  { id: 'youtube', label: 'YouTube', icon: <Youtube className="h-5 w-5" /> },
  { id: 'tiktok', label: 'TikTok', icon: <Rss className="h-5 w-5" /> },
];


export function QrickApp() {
  const [generatorType, setGeneratorType] = useState<GeneratorType>("qr");
  const [barcodeFormat, setBarcodeFormat] = useState<BarcodeFormat>("CODE128");
  const [content, setContent] = useState<string>("camly.in");
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
  const [qrTextElements, setQrTextElements] = useState<QrTextElement[]>([]);
  const [qrImageElements, setQrImageElements] = useState<QrImageElement[]>([]);
  const [selectedQrText, setSelectedQrText] = useState<string | null>(null);
  const [qrPadding, setQrPadding] = useState<number>(8);
  const [barcodeMargin, setBarcodeMargin] = useState<number>(10);

  // New QR Styling states
  const [qrStylingEngine, setQrStylingEngine] = useState<QRStylingEngine>("legacy");
  const [dotStyle, setDotStyle] = useState<DotType>("square");
  const [cornerSquareStyle, setCornerSquareStyle] = useState<CornerSquareType>("square");
  const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotType>("square");


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
  
  // QR Data type states
  const [qrDataType, setQrDataType] = useState<QrDataType>('text');
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [smsPhone, setSmsPhone] = useState<string>('');
  const [smsMessage, setSmsMessage] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [emailTo, setEmailTo] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  
  // vCard States
  const [vCardFirstName, setVCardFirstName] = useState('');
  const [vCardLastName, setVCardLastName] = useState('');
  const [vCardOrg, setVCardOrg] = useState('');
  const [vCardTitle, setVCardTitle] = useState('');
  const [vCardPhone, setVCardPhone] = useState('');
  const [vCardEmail, setVCardEmail] = useState('');
  const [vCardWebsite, setVCardWebsite] = useState('');
  const [vCardAddress, setVCardAddress] = useState('');

  // Geolocation States
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Event States
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // WhatsApp State
  const [whatsappPhone, setWhatsappPhone] = useState('');

  // Social Media States
  const [socialUsername, setSocialUsername] = useState('');

  const [youtubeUrl, setYoutubeUrl] = useState('');


  useEffect(() => {
    let newContent = '';
    const formatVCard = () => {
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
        vcard += `N:${vCardLastName};${vCardFirstName}\n`;
        vcard += `FN:${vCardFirstName} ${vCardLastName}\n`;
        if (vCardOrg) vcard += `ORG:${vCardOrg}\n`;
        if (vCardTitle) vcard += `TITLE:${vCardTitle}\n`;
        if (vCardPhone) vcard += `TEL;TYPE=WORK,VOICE:${vCardPhone}\n`;
        if (vCardEmail) vcard += `EMAIL:${vCardEmail}\n`;
        if (vCardWebsite) vcard += `URL:${vCardWebsite}\n`;
        if (vCardAddress) vcard += `ADR;TYPE=WORK:;;${vCardAddress}\n`;
        vcard += 'END:VCARD';
        return vcard;
    };
    const formatEvent = () => {
        let vevent = 'BEGIN:VEVENT\n';
        if (eventTitle) vevent += `SUMMARY:${eventTitle}\n`;
        if (eventLocation) vevent += `LOCATION:${eventLocation}\n`;
        if (eventStart) vevent += `DTSTART:${eventStart.replace(/-/g, '').replace(/:/g, '')}00Z\n`;
        if (eventEnd) vevent += `DTEND:${eventEnd.replace(/-/g, '').replace(/:/g, '')}00Z\n`;
        if (eventDescription) vevent += `DESCRIPTION:${eventDescription}\n`;
        vevent += 'END:VEVENT';
        return `BEGIN:VCALENDAR\nVERSION:2.0\n${vevent}\nEND:VCALENDAR`;
    };

    switch (qrDataType) {
      case 'wifi':
        newContent = `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
        break;
      case 'sms':
        newContent = `SMSTO:${smsPhone}:${smsMessage}`;
        break;
      case 'phone':
        newContent = `tel:${phone}`;
        break;
      case 'email':
        const subject = encodeURIComponent(emailSubject);
        const body = encodeURIComponent(emailBody);
        newContent = `mailto:${emailTo}?subject=${subject}&body=${body}`;
        break;
      case 'vcard':
        newContent = formatVCard();
        break;
      case 'geolocation':
        newContent = `geo:${latitude},${longitude}`;
        break;
      case 'event':
        newContent = formatEvent();
        break;
      case 'whatsapp':
        newContent = `https://wa.me/${whatsappPhone}`;
        break;
      case 'facebook':
        newContent = `https://www.facebook.com/${socialUsername}`;
        break;
      case 'twitter':
        newContent = `https://twitter.com/${socialUsername}`;
        break;
      case 'instagram':
        newContent = `https://www.instagram.com/${socialUsername}`;
        break;
      case 'linkedin':
        newContent = `https://www.linkedin.com/in/${socialUsername}`;
        break;
      case 'youtube':
        newContent = youtubeUrl;
        break;
      case 'tiktok':
        newContent = `https://www.tiktok.com/@${socialUsername}`;
        break;
      case 'text':
      default:
        // do not change content if it is already text
        return;
    }
    setContent(newContent);
  }, [qrDataType, wifiSsid, wifiPassword, wifiEncryption, smsPhone, smsMessage, phone, emailTo, emailSubject, emailBody,
      vCardFirstName, vCardLastName, vCardOrg, vCardTitle, vCardPhone, vCardEmail, vCardWebsite, vCardAddress,
      latitude, longitude,
      eventTitle, eventLocation, eventStart, eventEnd, eventDescription,
      whatsappPhone, socialUsername, youtubeUrl]);

  const handleQrDataTypeChange = (value: QrDataType) => {
    setQrDataType(value);
    switch (value) {
        case 'text':
            setContent('camly.in');
            break;
        case 'wifi':
            setContent(`WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`);
            break;
        case 'sms':
            setContent(`SMSTO:${smsPhone}:${smsMessage}`);
            break;
        case 'phone':
            setContent(`tel:${phone}`);
            break;
        case 'email':
            setContent(`mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
            break;
        case 'vcard': setContent(''); break;
        case 'geolocation': setContent(''); break;
        case 'event': setContent(''); break;
        case 'whatsapp': setContent(''); break;
        case 'facebook': case 'twitter': case 'instagram': case 'linkedin': case 'tiktok':
            setSocialUsername(''); setContent(''); break;
        case 'youtube': setYoutubeUrl(''); setContent(''); break;
    }
  };


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrImageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const cardBgInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const drawQR = useCallback(async () => {
    setBarcodeError(null);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pixelRatio = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Calculate total space needed for text
    const textSpace = { top: 0, bottom: 0, left: 0, right: 0 };
    qrTextElements.forEach(textEl => {
        ctx.font = `${textEl.size}px sans-serif`;
        const metrics = ctx.measureText(textEl.text);
        const textDim = textEl.isVertical ? textEl.size : metrics.width;
        
        switch (textEl.position) {
            case 'top': textSpace.top += textEl.size + textEl.margin; break;
            case 'bottom': textSpace.bottom += textEl.size + textEl.margin; break;
            case 'left': textSpace.left += textDim + textEl.margin; break;
            case 'right': textSpace.right += textDim + textEl.margin; break;
        }
    });

    const qrXBase = textSpace.left;
    const qrYBase = textSpace.top;
    const qrRightBase = qrXBase + size;
    const qrBottomBase = qrYBase + size;

    // Calculate total space needed for images
    const imageSpace = { top: 0, bottom: 0, left: 0, right: 0 };
    qrImageElements.forEach(imageEl => {
        if (imageEl.x < qrXBase) {
            imageSpace.left = Math.max(imageSpace.left, qrXBase - imageEl.x);
        }
        if (imageEl.y < qrYBase) {
            imageSpace.top = Math.max(imageSpace.top, qrYBase - imageEl.y);
        }
        if (imageEl.x + imageEl.width > qrRightBase) {
            imageSpace.right = Math.max(imageSpace.right, (imageEl.x + imageEl.width) - qrRightBase);
        }
        if (imageEl.y + imageEl.height > qrBottomBase) {
            imageSpace.bottom = Math.max(imageSpace.bottom, (imageEl.y + imageEl.height) - qrBottomBase);
        }
    });

    const totalSpace = {
        top: textSpace.top + imageSpace.top,
        bottom: textSpace.bottom + imageSpace.bottom,
        left: textSpace.left + imageSpace.left,
        right: textSpace.right + imageSpace.right,
    };

    const canvasWidth = size + totalSpace.left + totalSpace.right + (qrPadding * 2);
    const canvasHeight = size + totalSpace.top + totalSpace.bottom + (qrPadding * 2);
    
    canvas.width = canvasWidth * pixelRatio;
    canvas.height = canvasHeight * pixelRatio;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(pixelRatio, pixelRatio);


    // Fill background for the entire canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    const qrX = totalSpace.left + qrPadding;
    const qrY = totalSpace.top + qrPadding;
    const qrSize = size;
    const qrWithMarginSize = qrSize;


    if (qrStylingEngine === 'styling') {
        const qrCode = new QRCodeStyling({
            width: qrWithMarginSize,
            height: qrWithMarginSize,
            data: content,
            image: imageUrl,
            margin: 0,
            qrOptions: {
                errorCorrectionLevel: level,
            },
            dotsOptions: {
                color: fgColor,
                type: dotStyle,
                gradient: gradientType === 'none' ? undefined : {
                    type: gradientType,
                    colorStops: [
                        { offset: 0, color: gradientStartColor },
                        { offset: 1, color: gradientEndColor }
                    ]
                }
            },
            cornersSquareOptions: {
                color: fgColor,
                type: cornerSquareStyle,
            },
            cornersDotOptions: {
                color: fgColor,
                type: cornerDotStyle
            },
            backgroundOptions: {
                color: 'rgba(0,0,0,0)'
            },
            imageOptions: {
                hideBackgroundDots: excavate,
                imageSize: imageSize / qrWithMarginSize,
                margin: 4
            }
        });
        
        const qrBlob = await qrCode.getRawData("png");
        if(qrBlob) {
            const qrImage = new Image();
            qrImage.src = URL.createObjectURL(qrBlob);
            await new Promise((resolve) => {
                qrImage.onload = resolve;
            });
            ctx.drawImage(qrImage, qrX, qrY);
        }

    } else {
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
            ctx.translate(qrX, qrY);

            if (gradientType !== 'none') {
                let gradient: CanvasGradient;
                if (gradientType === 'linear') {
                    gradient = ctx.createLinearGradient(0, 0, qrWithMarginSize, qrWithMarginSize);
                } else {
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
            
            ctx.restore();

            if (imageUrl) {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = imageUrl;
                img.onload = () => {
                    const imgX = qrX + (qrSize - imageSize) / 2;
                    const imgY = qrY + (qrSize - imageSize) / 2;
                    
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
    }

    // Draw all text elements
    qrTextElements.forEach(textEl => {
        ctx.save();
        ctx.fillStyle = textEl.color;
        ctx.font = `${textEl.size}px sans-serif`;

        if (textEl.isVertical) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            let textX = 0;
            if (textEl.position === 'left') {
                textX = totalSpace.left - (textEl.size/2) - textEl.margin
            } else { // right
                textX = qrX + qrSize + qrPadding + textEl.margin + (textEl.size/2);
            }
            const textY = canvasHeight / 2;
            
            ctx.translate(textX, textY);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(textEl.text, 0, 0);

        } else {
            ctx.textBaseline = "middle";
            ctx.textAlign = textEl.align;
            let textX = 0;
            let textY = 0;

            switch (textEl.position) {
                case 'top':
                    textY = totalSpace.top - (textEl.size/2) - textEl.margin
                    textX = textEl.align === 'center' ? canvasWidth / 2 : (textEl.align === 'left' ? totalSpace.left : canvasWidth - totalSpace.right);
                    break;
                case 'bottom':
                    textY = qrY + qrSize + qrPadding + textEl.margin + (textEl.size/2)
                    textX = textEl.align === 'center' ? canvasWidth / 2 : (textEl.align === 'left' ? totalSpace.left : canvasWidth - totalSpace.right);
                    break;
                case 'left':
                    textX = totalSpace.left - (ctx.measureText(textEl.text).width / 2) - textEl.margin;
                    textY = canvasHeight / 2;
                    break;
                case 'right':
                    textX = qrX + qrSize + qrPadding + textEl.margin + (ctx.measureText(textEl.text).width / 2);
                    textY = canvasHeight / 2;
                    break;
            }
            ctx.fillText(textEl.text, textX, textY);
        }
        ctx.restore();
    });

    // Draw multiple images
    qrImageElements.forEach(element => {
        const elImg = new Image();
        elImg.crossOrigin = "anonymous";
        elImg.src = element.url;
        elImg.onload = () => {
            ctx.drawImage(elImg, element.x, element.y, element.width, element.height);
        };
        ctx.drawImage(elImg, element.x, element.y, element.width, element.height);
    });

    // Draw selection box and handles for images
    const selectedImage = qrImageElements.find(el => el.id === selectedElement);
    if (selectedImage) {
        ctx.strokeStyle = 'rgba(0, 123, 255, 0.7)';
        ctx.lineWidth = 2 / pixelRatio; // Adjust line width for high DPI
        ctx.strokeRect(selectedImage.x, selectedImage.y, selectedImage.width, selectedImage.height);
        const handleSize = 8;
        const handles = {
            tl: { x: selectedImage.x - handleSize / 2, y: selectedImage.y - handleSize / 2 },
            tr: { x: selectedImage.x + selectedImage.width - handleSize / 2, y: selectedImage.y - handleSize / 2 },
            bl: { x: selectedImage.x - handleSize / 2, y: selectedImage.y + selectedImage.height - handleSize / 2 },
            br: { x: selectedImage.x + selectedImage.width - handleSize / 2, y: selectedImage.y + selectedImage.height - handleSize / 2 },
        };
        ctx.fillStyle = 'rgba(0, 123, 255, 0.9)';
        Object.values(handles).forEach(handle => {
            ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
        });
    }

  }, [content, size, level, fgColor, bgColor, qrStyle, imageUrl, imageSize, excavate, useShieldCorners, gradientType, gradientStartColor, gradientEndColor, qrTextElements, qrImageElements, selectedElement, qrStylingEngine, dotStyle, cornerSquareStyle, cornerDotStyle, qrPadding]);

    const drawBarcodeOrCard = useCallback(async () => {
        setBarcodeError(null);
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (generateCard) {
            const cardWidth = 400;
            const cardHeight = 225;
            const pixelRatio = 4; // Increase for higher quality
            
            canvas.width = cardWidth * pixelRatio;
            canvas.height = cardHeight * pixelRatio;
            canvas.style.width = `${cardWidth}px`;
            canvas.style.height = `${cardHeight}px`;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            ctx.scale(pixelRatio, pixelRatio);
            ctx.clearRect(0, 0, cardWidth, cardHeight);


            const drawBackground = () => {
                // Background
                ctx.fillStyle = cardBgColor;
                ctx.fillRect(0, 0, cardWidth, cardHeight);

                // Card design elements
                ctx.fillStyle = cardAccentColor;
                ctx.strokeStyle = cardAccentColor;
                ctx.lineWidth = 2;
                switch (cardDesign) {
                    case 'modern':
                        ctx.fillRect(0, 0, 100, cardHeight);
                        break;
                    case 'sleek':
                        ctx.fillRect(0, 0, cardWidth, 60);
                        break;
                    case 'professional':
                        ctx.beginPath();
                        ctx.moveTo(50, 95);
                        ctx.lineTo(cardWidth - 50, 95);
                        ctx.stroke();
                        break;
                    case 'vcard':
                        ctx.fillRect(0, 0, cardWidth, 60);
                        break;
                    case 'marriage': {
                        ctx.lineWidth = 1;
                        for (let i = 0; i < 20; i++) {
                            ctx.beginPath();
                            ctx.arc(
                                Math.random() * cardWidth,
                                Math.random() * cardHeight,
                                Math.random() * 20,
                                0, 2 * Math.PI
                            );
                            ctx.stroke();
                        }
                        break;
                    }
                };
            };
            
            const renderElements = async () => {
                // Draw elements
                for (const element of cardElements) {
                    if (element.type === 'image') {
                        const elImg = new Image();
                        elImg.crossOrigin = "anonymous";
                        elImg.src = element.content;
                        try {
                            await elImg.decode();
                            ctx.drawImage(elImg, element.x, element.y, element.width, element.height);
                        } catch (e) { console.error("image load error");}

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
                            JsBarcode(tempCanvas, element.content, {
                                format: barcodeFormat,
                                lineColor: fgColor,
                                background: 'rgba(0,0,0,0)',
                                width: 4, // Higher resolution
                                height: 80, // Higher resolution
                                displayValue: false,
                                valid: (valid: boolean) => { isValid = valid; }
                            });
                            
                            if (!isValid) {
                                setBarcodeError("Invalid barcode content for card.");
                                continue;
                            }
                            
                            const textHeight = showBarcodeText ? (barcodeTextSize + 10) : 0;
                            const barcodeTop = barcodeTextPosition === 'top' ? textHeight : 0;
                            
                            ctx.drawImage(tempCanvas, element.x, element.y + barcodeTop, element.width, element.height);
                            
                            if (showBarcodeText) {
                                ctx.font = `${barcodeTextSize}px monospace`;
                                ctx.fillStyle = textColor;
                                ctx.textAlign = 'center';

                                const textY = barcodeTextPosition === 'top'
                                    ? element.y + barcodeTextSize
                                    : element.y + element.height + textHeight;
                                
                                ctx.fillText(element.content, element.x + element.width / 2, textY);
                            }

                        } catch (err: any) {
                            setBarcodeError(err.message || "Error generating barcode for card.");
                        }
                    } else if (element.type === 'qrcode') {
                         try {
                            const qrDataUrl = await QRCode.toDataURL(element.content, {
                                errorCorrectionLevel: level,
                                width: element.width * pixelRatio, // Draw QR at high res
                                margin: 1, 
                                color: { dark: fgColor, light: '#00000000' }
                            });
                            
                            const qrImg = new Image();
                            qrImg.src = qrDataUrl;
                            await qrImg.decode();
                            ctx.drawImage(qrImg, element.x, element.y, element.width, element.height);
                         } catch (e) {
                             console.error("Failed to generate QR code for card", e);
                         }
                    }
                }
                
                // Draw selection box and handles
                const selected = cardElements.find(el => el.id === selectedElement);
                if (selected) {
                    ctx.strokeStyle = 'rgba(0, 123, 255, 0.7)';
                    ctx.lineWidth = 2 / pixelRatio;
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
                bgImg.onload = async () => {
                    const pattern = ctx.createPattern(bgImg, 'repeat');
                    if (pattern) {
                        ctx.fillStyle = pattern;
                        ctx.fillRect(0, 0, cardWidth, cardHeight);
                    }
                    await renderElements();
                };
            } else {
                drawBackground();
                await renderElements();
            }


        } else {
            // Barcode-only Drawing Logic
            const displayWidth = 320;
            const displayHeight = 80;
            const scale = 4;
            
            canvas.width = (displayWidth * scale) + (barcodeMargin * 2 * scale);
            const textHeight = showBarcodeText ? (barcodeTextSize * 2.5) * scale / 2 : 0;
            const canvasHeight = (displayHeight * scale) + textHeight + (barcodeMargin * 2 * scale);
            canvas.height = canvasHeight;
            canvas.style.width = `${displayWidth + barcodeMargin * 2}px`;
            canvas.style.height = `${displayHeight + (showBarcodeText ? barcodeTextSize * 1.25 : 0) + barcodeMargin * 2}px`;
            
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
                const barcodeTop = (barcodeTextPosition === 'top' && showBarcodeText ? textHeight : 0) + (barcodeMargin * scale);

                if (ctx) {
                    ctx.drawImage(tempCanvas, (canvas.width - barcodeWidth) / 2, barcodeTop, barcodeWidth, barcodeHeightCalculated);
                    if (showBarcodeText) {
                        ctx.font = `${barcodeTextSize * scale}px monospace`;
                        ctx.fillStyle = textColor;
                        ctx.textAlign = 'center';
                        const textY = barcodeTextPosition === 'top' ? (barcodeTextSize * scale) + (barcodeMargin * scale) : barcodeHeightCalculated + (barcodeTextSize * scale) + (barcodeMargin * scale);
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
    }, [content, barcodeFormat, fgColor, bgColor, textColor, showBarcodeText, generateCard, cardBgColor, cardTextColor, cardDesign, cardAccentColor, cardElements, selectedElement, cardBgImageUrl, barcodeTextPosition, barcodeMargin, barcodeHeight, barcodeTextSize, level, content]);

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

    const canvasWidth = 400;
    const canvasHeight = 225;
    const ctx = canvasRef.current?.getContext('2d');
    
    if(!ctx) return;

    const newElements: CardElement[] = [];

    // Common barcode properties
    const barcodeWidth = 120;
    const barcodeHeightVal = 40;

    
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
        title: { content: defaultTitle, font: `sans-serif`, fontSize: 24, align: 'center', color: cardTextColor },
        subtitle: { content: defaultSubtitle, font: `sans-serif`, fontSize: 16, align: 'center', color: cardTextColor },
        email: { content: defaultEmail, font: `sans-serif`, fontSize: 14, align: 'left', color: cardTextColor },
        phone: { content: defaultPhone, font: `sans-serif`, fontSize: 14, align: 'left', color: cardTextColor },
        website: { content: defaultWebsite, font: `sans-serif`, fontSize: 14, align: 'left', color: cardTextColor },
    };
    
    // Position elements based on design
    switch (cardDesign) {
        case 'classic': {
            const titleMetrics = getTextMetrics(textElements.title.content!, textElements.title.font!, textElements.title.fontSize!, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, textElements.subtitle.font!, textElements.subtitle.fontSize!, ctx);
            newElements.push({ id: 'title', type: 'text', ...textElements.title, x: (canvasWidth - titleMetrics.width) / 2, y: 50, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, x: (canvasWidth - subtitleMetrics.width) / 2, y: 80, ...subtitleMetrics });
            newElements.push({ id: `code-${Date.now()}`, type: generatorType === 'qr' ? 'qrcode' : 'barcode', content: content, x: (canvasWidth - barcodeWidth) / 2, y: 120, width: barcodeWidth, height: generatorType === 'qr' ? barcodeWidth : barcodeHeightVal });
            break;
        }
        case 'modern': {
            const accentWidth = 100;
            const titleMetrics = getTextMetrics(textElements.title.content!, textElements.title.font!, 22, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, textElements.subtitle.font!, 14, ctx);
            newElements.push({ id: 'title', type: 'text', ...textElements.title, fontSize: 22, align: 'left', x: accentWidth + 20, y: 60, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, fontSize: 14, align: 'left', x: accentWidth + 20, y: 90, ...subtitleMetrics });
            newElements.push({ id: `code-${Date.now()}`, type: generatorType === 'qr' ? 'qrcode' : 'barcode', content: content, x: (canvasWidth - barcodeWidth + accentWidth) / 2, y: 120, width: barcodeWidth, height: generatorType === 'qr' ? barcodeWidth : barcodeHeightVal });
            break;
        }
        case 'sleek': {
            const titleMetrics = getTextMetrics(textElements.title.content!, textElements.title.font!, 20, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, textElements.subtitle.font!, 14, ctx);
            newElements.push({ id: 'title', type: 'text', ...textElements.title, fontSize: 20, color: cardBgColor, align: 'left', x: 20, y: 40, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, fontSize: 14, align: 'left', x: 20, y: 60 + 30, ...subtitleMetrics });
            newElements.push({ id: `code-${Date.now()}`, type: generatorType === 'qr' ? 'qrcode' : 'barcode', content: content, x: (canvasWidth - barcodeWidth) / 2, y: 110, width: barcodeWidth, height: generatorType === 'qr' ? barcodeWidth : barcodeHeightVal });
            break;
        }
        case 'professional': {
            const titleMetrics = getTextMetrics(textElements.title.content!, textElements.title.font!, 22, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, textElements.subtitle.font!, 14, ctx);
            newElements.push({ id: 'title', type: 'text', ...textElements.title, fontSize: 22, x: (canvasWidth - titleMetrics.width) / 2, y: 50, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, fontSize: 14, x: (canvasWidth - subtitleMetrics.width) / 2, y: 75, ...subtitleMetrics });
            newElements.push({ id: `code-${Date.now()}`, type: generatorType === 'qr' ? 'qrcode' : 'barcode', content: content, x: (canvasWidth - barcodeWidth) / 2, y: 115, width: barcodeWidth, height: generatorType === 'qr' ? barcodeWidth : barcodeHeightVal });
            break;
        }
        case 'vcard': {
            const qrCodeSize = 80;
            const titleMetrics = getTextMetrics(textElements.title.content!, textElements.title.font!, 20, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, textElements.subtitle.font!, 12, ctx);
            const emailMetrics = getTextMetrics(defaultEmail, textElements.email.font!, textElements.email.fontSize!, ctx);
            const phoneMetrics = getTextMetrics(defaultPhone, textElements.phone.font!, textElements.phone.fontSize!, ctx);
            const websiteMetrics = getTextMetrics(defaultWebsite, textElements.website.font!, textElements.website.fontSize!, ctx);

            newElements.push({ id: 'title', type: 'text', ...textElements.title, fontSize: 20, color: cardBgColor, align: 'left', x: 20, y: 30, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, fontSize: 12, font: 'italic sans-serif', color: cardBgColor, align: 'left', x: 20, y: 50, ...subtitleMetrics });
            const infoStartY = 80;
            const infoSpacing = 25;
            newElements.push({ id: 'email', type: 'text', ...textElements.email, x: 40, y: infoStartY, ...emailMetrics });
            newElements.push({ id: 'phone', type: 'text', ...textElements.phone, x: 40, y: infoStartY + infoSpacing, ...phoneMetrics });
            newElements.push({ id: 'website', type: 'text', ...textElements.website, x: 40, y: infoStartY + infoSpacing * 2, ...websiteMetrics });
            newElements.push({ id: `code-${Date.now()}`, type: 'qrcode', content: content, x: canvasWidth - qrCodeSize - 20, y: infoStartY, width: qrCodeSize, height: qrCodeSize });
            break;
        }
         case 'marriage': {
            const titleFont = `'Great Vibes', cursive`;
            const subtitleFont = `italic sans-serif`;

            const titleMetrics = getTextMetrics(textElements.title.content!, titleFont, 36, ctx);
            const subtitleMetrics = getTextMetrics(textElements.subtitle.content!, subtitleFont, 16, ctx);
            
            newElements.push({ id: 'title', type: 'text', ...textElements.title, font: titleFont, fontSize: 36, x: (canvasWidth - titleMetrics.width) / 2, y: 80, ...titleMetrics });
            newElements.push({ id: 'subtitle', type: 'text', ...textElements.subtitle, font: subtitleFont, fontSize: 16, x: (canvasWidth - subtitleMetrics.width) / 2, y: 120, ...subtitleMetrics });
            newElements.push({ id: `code-${Date.now()}`, type: generatorType === 'qr' ? 'qrcode' : 'barcode', content: content, x: (canvasWidth - barcodeWidth) / 2, y: 155, width: barcodeWidth, height: generatorType === 'qr' ? barcodeWidth : barcodeHeightVal });
            break;
        }
    }
    setCardElements(newElements);
    setSelectedElement(null);
}, [generateCard, cardDesign, content, barcodeFormat, fgColor, cardTextColor, cardBgColor, generatorType]);


  useEffect(() => {
      if (content) {
        if (generatorType === 'qr' && !generateCard) {
            drawQR();
        } else if (generatorType === 'barcode' || generateCard) {
            drawBarcodeOrCard();
        }
      } else {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            if (generatorType === 'qr' && !generateCard) {
                ctx.clearRect(0,0,size,size);
            } else if (generatorType === 'barcode' || generateCard) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        setBarcodeError(null);
      }
  }, [drawQR, drawBarcodeOrCard, content, size, generatorType, fgColor, bgColor, textColor, barcodeHeight, barcodeTextSize, level, qrStyle, imageUrl, imageSize, excavate, useShieldCorners, gradientType, gradientStartColor, gradientEndColor, generateCard, cardElements, selectedElement, showBarcodeText, barcodeTextPosition, qrTextElements, qrImageElements, qrStylingEngine, dotStyle, cornerSquareStyle, cornerDotStyle, qrPadding, barcodeMargin]);

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
        
        const displayWidth = parseInt(canvas.style.width, 10);
        const displayHeight = parseInt(canvas.style.height, 10);
        
        const scaleX = displayWidth / rect.width;
        const scaleY = displayHeight / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    };

    const getResizeHandle = (pos: {x: number, y: number}, element: CardElement | QrImageElement): ResizeHandle | null => {
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
        e.preventDefault();
        const pos = getPointerPosition(e);
        
        let elements: (CardElement | QrImageElement)[] = [];
        if (generateCard) {
            elements = cardElements;
        } else if (generatorType === 'qr') {
            elements = qrImageElements;
        } else {
            return;
        }

        if (selectedElement) {
            const element = elements.find(el => el.id === selectedElement);
            if(element) {
                const handle = getResizeHandle(pos, element);
                if (handle) {
                    setResizingState({ elementId: selectedElement, handle });
                    return;
                }
            }
        }

        const clickedElement = [...elements].reverse().find(el => 
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
        
        let elements: (CardElement | QrImageElement)[] = [];
        let setElements: React.Dispatch<React.SetStateAction<any[]>>;

        if (generateCard) {
            elements = cardElements;
            setElements = setCardElements as React.Dispatch<React.SetStateAction<any[]>>;
        } else if (generatorType === 'qr') {
            elements = qrImageElements;
            setElements = setQrImageElements as React.Dispatch<React.SetStateAction<any[]>>;
        } else {
            return;
        }

        if (resizingState) {
            setElements(prev => prev.map(el => {
                if (el.id === resizingState.elementId) {
                    let { x, y, width, height } = el;
                    const originalX = el.x;
                    const originalY = el.y;
                    const originalWidth = el.width;
                    const originalHeight = el.height;
                    const aspectRatio = originalWidth / originalHeight;

                    switch (resizingState.handle) {
                        case 'tl':
                            width = originalX + originalWidth - pos.x;
                            height = width / aspectRatio;
                            x = pos.x;
                            y = originalY + originalHeight - height;
                            break;
                        case 'tr':
                            width = pos.x - originalX;
                            height = width / aspectRatio;
                            y = originalY + originalHeight - height;
                            break;
                        case 'bl':
                            width = originalX + originalWidth - pos.x;
                            height = width / aspectRatio;
                            x = pos.x;
                            break;
                        case 'br':
                            width = pos.x - originalX;
                            height = width / aspectRatio;
                            break;
                    }
                    const newWidth = Math.max(width, 20);
                    const newHeight = Math.max(height, 20);
                    
                    if (el.type === 'text' && generateCard) {
                        const newFontSize = newHeight / 1.2;
                        return { ...el, x, y, width: newWidth, height: newHeight, fontSize: newFontSize };
                    }

                    return { ...el, x, y, width: newWidth, height: newHeight };
                }
                return el;
            }));
        } else if (draggingElement) {
            setElements(prev => prev.map(el =>
                el.id === draggingElement
                    ? { ...el, x: pos.x - dragOffset.x, y: pos.y - dragOffset.y }
                    : el
            ));
        } else if (generateCard || generatorType === 'qr') {
            const currentSelected = elements.find(el => el.id === selectedElement);
            let handleCursor = 'default';
            if (currentSelected) {
                const handle = getResizeHandle(pos, currentSelected);
                if (handle === 'tl' || handle === 'br') handleCursor = 'nwse-resize';
                else if (handle === 'tr' || handle === 'bl') handleCursor = 'nesw-resize';
            }
             if (handleCursor === 'default') {
                const currentHoveredElement = [...elements].reverse().find(el => 
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
                margin: barcodeMargin,
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
                color: { dark: fgColor, light: bgColor },
                margin: qrPadding / 8, // SVG margin is in modules, not pixels
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
  }, [toast, generatorType, barcodeFormat, barcodeError, content, level, fgColor, bgColor, barcodeHeight, barcodeTextSize, generateCard, showBarcodeText, barcodeTextPosition, qrPadding, barcodeMargin]);

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
                text: `Here is my ${generatorType === 'qr' ? 'QR code' : 'barcode'}. Generated with QRick.`,
                files: [file],
                url: 'https://qrick.vercel.app/',
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

  const handleQrImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: QrImageElement = {
            id: `qrimage-${Date.now()}`,
            url: reader.result as string,
            x: 50,
            y: 50,
            width: 100,
            height: 100,
        };
        setQrImageElements(prev => [...prev, newImage]);
        setSelectedElement(newImage.id);
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
        const newLogoElement: CardElement = {
            id: `image-${Date.now()}`,
            type: 'image',
            content: logoUrl,
            x: 50,
            y: 50,
            width: 100,
            height: 100,
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
  const triggerQrImageSelect = () => qrImageInputRef.current?.click();
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
    setSelectedElement(null);
    if (newType === 'qr' && !generateCard) {
        setContent('camly.in');
    } else if (newType === 'barcode' || generateCard) {
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
                newContent = '123456';
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
            setCardElements(prev => prev.map(el => (el.type === 'barcode' || el.type === 'qrcode') ? { ...el, content: newContent } : el));
        }
    }
  }

  const addTextElement = () => {
    const newTextElement: CardElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      x: 50,
      y: 50,
      width: 150,
      height: 30,
      fontSize: 16,
      color: cardTextColor,
      align: 'left',
      font: 'sans-serif'
    };
    setCardElements(prev => [...prev, newTextElement]);
    setSelectedElement(newTextElement.id);
  };

  const deleteSelectedElement = () => {
    if (selectedElement) {
        if (generateCard) {
            setCardElements(prev => prev.filter(el => el.id !== selectedElement));
        } else if (generatorType === 'qr') {
            setQrImageElements(prev => prev.filter(el => el.id !== selectedElement));
        }
      setSelectedElement(null);
    }
  };

  const updateSelectedElement = (prop: keyof CardElement, value: any) => {
    if (!selectedElement) return;

    setCardElements(prev => prev.map(el => 
        el.id === selectedElement ? { ...el, [prop]: value } : el
    ));

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

  const getCanvasDisplaySize = () => {
    if (generatorType === 'barcode' || generateCard) {
        return generateCard ? { width: 400, height: 225 } : { width: 320 + (barcodeMargin * 2), height: (showBarcodeText ? 80 + (barcodeTextSize * 2.5) : 80) + (barcodeMargin * 2) };
    }
    const canvas = canvasRef.current;
    if (canvas) {
        return { width: parseInt(canvas.style.width) || size, height: parseInt(canvas.style.height) || size };
    }
    return { width: size, height: size };
  }

  const addQrTextElement = () => {
    const newText: QrTextElement = {
        id: `qrtext-${Date.now()}`,
        text: 'Your Text Here',
        color: '#000000',
        size: 20,
        position: 'bottom',
        align: 'center',
        margin: 12,
        isVertical: false,
    };
    setQrTextElements(prev => [...prev, newText]);
    setSelectedQrText(newText.id);
  };

  const updateQrTextElement = (id: string, prop: keyof QrTextElement, value: any) => {
    setQrTextElements(prev => prev.map(el => el.id === id ? { ...el, [prop]: value } : el));
  };
  
  const removeQrTextElement = (id: string) => {
      setQrTextElements(prev => prev.filter(el => el.id !== id));
      setSelectedQrText(null);
  }

  const removeQrImageElement = (id: string) => {
      setQrImageElements(prev => prev.filter(el => el.id !== id));
      if (selectedElement === id) {
          setSelectedElement(null);
      }
  }
  
  const CardOptions = () => (
    <div className="grid gap-4">
        {generateCard && (
           <ScrollArea className="h-[28rem]">
            <div className="grid gap-4 pr-4">
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
                                    value={currentSelectedElement.fontSize ? Math.round(currentSelectedElement.fontSize) : 16}
                                    onChange={(e) => updateSelectedElement('fontSize', parseInt(e.target.value, 10))}
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
          </ScrollArea>
        )}
    </div>
  );

  const selectedQrTextElement = qrTextElements.find(el => el.id === selectedQrText);

  const currentSelectedElement = cardElements.find(el => el.id === selectedElement);
  const currentSelectedQrImage = qrImageElements.find(el => el.id === selectedElement);
  const isQrImageSelected = generatorType === 'qr' && !!currentSelectedQrImage;


  return (
    <Card className="w-full max-w-7xl shadow-2xl">
      <CardContent className="grid gap-8 md:grid-cols-[450px_1fr] p-4 pt-6">
        <div className="grid gap-4">
          <Tabs defaultValue="qr" value={generatorType} onValueChange={handleGeneratorTypeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr"><QrCode className="mr-2"/>QR Code</TabsTrigger>
                <TabsTrigger value="barcode"><Barcode className="mr-2"/>Barcode</TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="pt-4">
                <div className="grid gap-4">
                     <div className="grid gap-2">
                        <Label>Data Type</Label>
                        <Select value={qrDataType} onValueChange={(v) => handleQrDataTypeChange(v as QrDataType)}>
                          <SelectTrigger>
                            <SelectValue asChild>
                              <div className="flex items-center gap-2">
                                {qrDataTypes.find(d => d.id === qrDataType)?.icon}
                                <span>{qrDataTypes.find(d => d.id === qrDataType)?.label}</span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {qrDataTypes.map(item => (
                              <SelectItem key={item.id} value={item.id}>
                                <div className="flex items-center gap-2">
                                  {item.icon}
                                  <span>{item.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    </div>

                    {qrDataType === 'text' && (
                        <div className="grid gap-2">
                            <Label htmlFor="qr-content">Content</Label>
                            <Textarea
                                id="qr-content"
                                placeholder="Enter URL or text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="text-sm"
                                rows={3}
                            />
                        </div>
                    )}
                     {qrDataType === 'wifi' && (
                        <div className="grid gap-4 p-4 border rounded-lg">
                            <div className="grid gap-2">
                                <Label htmlFor="wifi-ssid">SSID (Network Name)</Label>
                                <Input id="wifi-ssid" placeholder="MyNetwork" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="wifi-password">Password</Label>
                                <Input id="wifi-password" type="password" placeholder="password123" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Encryption</Label>
                                <RadioGroup value={wifiEncryption} onValueChange={(v) => setWifiEncryption(v as any)} className="flex gap-4">
                                    <Label htmlFor="wifi-wpa" className="flex items-center gap-2 cursor-pointer text-sm"><RadioGroupItem value="WPA" id="wifi-wpa" />WPA/WPA2</Label>
                                    <Label htmlFor="wifi-wep" className="flex items-center gap-2 cursor-pointer text-sm"><RadioGroupItem value="WEP" id="wifi-wep" />WEP</Label>
                                    <Label htmlFor="wifi-nopass" className="flex items-center gap-2 cursor-pointer text-sm"><RadioGroupItem value="nopass" id="wifi-nopass" />None</Label>
                                </RadioGroup>
                            </div>
                        </div>
                    )}
                     {qrDataType === 'sms' && (
                        <div className="grid gap-4 p-4 border rounded-lg">
                            <div className="grid gap-2">
                                <Label htmlFor="sms-phone">Phone Number</Label>
                                <Input id="sms-phone" type="tel" placeholder="+1234567890" value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sms-message">Message</Label>
                                <Textarea id="sms-message" placeholder="Hello!" value={smsMessage} onChange={(e) => setSmsMessage(e.target.value)} />
                            </div>
                        </div>
                    )}
                    {qrDataType === 'phone' && (
                        <div className="grid gap-4 p-4 border rounded-lg">
                            <div className="grid gap-2">
                                <Label htmlFor="phone-number">Phone Number</Label>
                                <Input id="phone-number" type="tel" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                        </div>
                    )}
                    {qrDataType === 'email' && (
                        <div className="grid gap-4 p-4 border rounded-lg">
                            <div className="grid gap-2">
                                <Label htmlFor="email-to">To</Label>
                                <Input id="email-to" type="email" placeholder="recipient@example.com" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="email-subject">Subject</Label>
                                <Input id="email-subject" placeholder="Email Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email-body">Body</Label>
                                <Textarea id="email-body" placeholder="Email body content..." value={emailBody} onChange={(e) => setEmailBody(e.target.value)} />
                            </div>
                        </div>
                    )}
                     {qrDataType === 'vcard' && (
                        <ScrollArea className="h-96">
                            <div className="grid gap-4 p-4 border rounded-lg pr-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input placeholder="First Name" value={vCardFirstName} onChange={(e) => setVCardFirstName(e.target.value)} />
                                    <Input placeholder="Last Name" value={vCardLastName} onChange={(e) => setVCardLastName(e.target.value)} />
                                </div>
                                <Input placeholder="Organization" value={vCardOrg} onChange={(e) => setVCardOrg(e.target.value)} />
                                <Input placeholder="Job Title" value={vCardTitle} onChange={(e) => setVCardTitle(e.target.value)} />
                                <Input type="tel" placeholder="Phone" value={vCardPhone} onChange={(e) => setVCardPhone(e.target.value)} />
                                <Input type="email" placeholder="Email" value={vCardEmail} onChange={(e) => setVCardEmail(e.target.value)} />
                                <Input type="url" placeholder="Website" value={vCardWebsite} onChange={(e) => setVCardWebsite(e.target.value)} />
                                <Textarea placeholder="Address" value={vCardAddress} onChange={(e) => setVCardAddress(e.target.value)} />
                            </div>
                        </ScrollArea>
                    )}
                    {qrDataType === 'geolocation' && (
                        <div className="grid gap-4 p-4 border rounded-lg">
                            <Input placeholder="Latitude (e.g., 40.7128)" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                            <Input placeholder="Longitude (e.g., -74.0060)" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                        </div>
                    )}
                    {qrDataType === 'event' && (
                        <div className="grid gap-4 p-4 border rounded-lg">
                            <Input placeholder="Event Title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                            <Input placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input type="datetime-local" placeholder="Start Time" value={eventStart} onChange={(e) => setEventStart(e.target.value)} />
                                <Input type="datetime-local" placeholder="End Time" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} />
                            </div>
                            <Textarea placeholder="Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                        </div>
                    )}
                     {qrDataType === 'whatsapp' && (
                        <div className="grid gap-4 p-4 border rounded-lg">
                           <Input type="tel" placeholder="Phone number (with country code)" value={whatsappPhone} onChange={(e) => setWhatsappPhone(e.target.value)} />
                        </div>
                    )}
                    {['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok'].includes(qrDataType) && (
                        <div className="grid gap-4 p-4 border rounded-lg">
                           <Input placeholder="Username or Profile ID" value={socialUsername} onChange={(e) => setSocialUsername(e.target.value)} />
                        </div>
                    )}
                     {qrDataType === 'youtube' && (
                        <div className="grid gap-4 p-4 border rounded-lg">
                           <Input type="url" placeholder="YouTube Video or Channel URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
                        </div>
                    )}

                    <Separator/>
                    <Tabs defaultValue="style">
                        <TabsList className="grid w-full grid-cols-4">
                           <TabsTrigger value="style"><Palette className="mr-0 md:mr-2"/><span className="hidden md:inline">Style</span></TabsTrigger>
                           <TabsTrigger value="shape"><Shapes className="mr-0 md:mr-2"/><span className="hidden md:inline">Shape</span></TabsTrigger>
                           <TabsTrigger value="text"><Text className="mr-0 md:mr-2"/><span className="hidden md:inline">Text</span></TabsTrigger>
                           <TabsTrigger value="images"><ImageIcon className="mr-0 md:mr-2"/><span className="hidden md:inline">Images</span></TabsTrigger>
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
                                            <Label htmlFor="qr-padding">Padding ({qrPadding}px)</Label>
                                            <Slider id="qr-padding" min={0} max={64} step={2} value={[qrPadding]} onValueChange={(v) => setQrPadding(v[0])} />
                                        </div>
                                        <div className="grid gap-2 col-span-2">
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
                                        <Label htmlFor="qr-style">Module Style (Legacy)</Label>
                                        <Select
                                            value={qrStyle}
                                            onValueChange={(value: QRStyle) => { setQrStyle(value); setQrStylingEngine("legacy"); }}
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
                        <TabsContent value="shape" className="pt-4">
                           <ScrollArea className="h-96">
                               <div className="space-y-4 p-1">
                                    <p className="text-sm text-muted-foreground">Customize the shapes of the QR code modules. These settings use a different rendering engine.</p>
                                    <div className="grid gap-3">
                                        <Label>Body Shape</Label>
                                        <Select value={dotStyle} onValueChange={(v) => { setDotStyle(v as DotType); setQrStylingEngine("styling"); }}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="square">Square</SelectItem>
                                                <SelectItem value="dots">Dots</SelectItem>
                                                <SelectItem value="rounded">Rounded</SelectItem>
                                                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                                                <SelectItem value="classy">Classy</SelectItem>
                                                <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label>Corner Shape</Label>
                                        <Select value={cornerSquareStyle} onValueChange={(v) => { setCornerSquareStyle(v as CornerSquareType); setQrStylingEngine("styling"); }}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="square">Square</SelectItem>
                                                <SelectItem value="dot">Dot</SelectItem>
                                                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label>Corner Dot Shape</Label>
                                        <Select value={cornerDotStyle} onValueChange={(v) => { setCornerDotStyle(v as CornerDotType); setQrStylingEngine("styling"); }}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="square">Square</SelectItem>
                                                <SelectItem value="dot">Dot</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="text" className="pt-4">
                            <ScrollArea className="h-96">
                                <div className="grid gap-4 pr-4">
                                    <Button onClick={addQrTextElement} variant="outline" size="sm">
                                        <PlusCircle className="mr-2" /> Add Text
                                    </Button>
                                    <div className="grid gap-2">
                                        {qrTextElements.map(el => (
                                            <div key={el.id} className="flex items-center justify-between p-2 border rounded-lg">
                                                <span className="truncate flex-1 pr-2">{el.text}</span>
                                                <div className="flex items-center gap-1">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80">
                                                            <div className="grid gap-4">
                                                                <div className="space-y-2">
                                                                    <h4 className="font-medium leading-none">Edit Text</h4>
                                                                    <p className="text-sm text-muted-foreground">Customize the text element.</p>
                                                                </div>
                                                                <div className="grid gap-2">
                                                                     <div className="grid gap-2">
                                                                        <Label htmlFor={`qr-text-${el.id}`}>Text</Label>
                                                                        <Input id={`qr-text-${el.id}`} value={el.text} onChange={(e) => updateQrTextElement(el.id, 'text', e.target.value)} />
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Switch id={`vertical-text-${el.id}`} checked={el.isVertical} onCheckedChange={(checked) => updateQrTextElement(el.id, 'isVertical', checked)} />
                                                                        <Label htmlFor={`vertical-text-${el.id}`} className="flex items-center gap-2 cursor-pointer"><Pilcrow className="h-4 w-4 -rotate-90" /> Vertical</Label>
                                                                    </div>
                                                                    <div className="grid gap-2">
                                                                        <Label>Position</Label>
                                                                        <Select value={el.position} onValueChange={(v) => updateQrTextElement(el.id, 'position', v as QrTextPosition)}>
                                                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="top" disabled={el.isVertical}>Top</SelectItem>
                                                                                <SelectItem value="bottom" disabled={el.isVertical}>Bottom</SelectItem>
                                                                                <SelectItem value="left">Left</SelectItem>
                                                                                <SelectItem value="right">Right</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                     <div className="grid gap-2">
                                                                        <Label>Align</Label>
                                                                        <RadioGroup value={el.align} onValueChange={(v) => updateQrTextElement(el.id, 'align', v as CanvasTextAlign)} className="flex gap-2">
                                                                            <Label htmlFor={`align-left-${el.id}`} className="p-2 border rounded-md cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground"><RadioGroupItem value="left" id={`align-left-${el.id}`} className="sr-only"/><AlignLeft className="h-5 w-5"/></Label>
                                                                            <Label htmlFor={`align-center-${el.id}`} className="p-2 border rounded-md cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground"><RadioGroupItem value="center" id={`align-center-${el.id}`} className="sr-only"/><AlignCenter className="h-5 w-5"/></Label>
                                                                            <Label htmlFor={`align-right-${el.id}`} className="p-2 border rounded-md cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground"><RadioGroupItem value="right" id={`align-right-${el.id}`} className="sr-only"/><AlignRight className="h-5 w-5"/></Label>
                                                                        </RadioGroup>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="grid gap-2">
                                                                            <Label htmlFor={`qr-text-color-${el.id}`}>Color</Label>
                                                                            <Input id={`qr-text-color-${el.id}`} type="color" value={el.color} onChange={(e) => updateQrTextElement(el.id, 'color', e.target.value)} className="p-1 h-9" />
                                                                        </div>
                                                                        <div className="grid gap-2">
                                                                            <Label htmlFor={`qr-text-size-${el.id}`}>Font Size ({el.size}px)</Label>
                                                                            <Slider id={`qr-text-size-${el.id}`} min={8} max={48} step={1} value={[el.size]} onValueChange={(v) => updateQrTextElement(el.id, 'size', v[0])} />
                                                                        </div>
                                                                    </div>
                                                                     <div className="grid gap-2">
                                                                        <Label htmlFor={`qr-text-margin-${el.id}`}>Margin ({el.margin}px)</Label>
                                                                        <Slider id={`qr-text-margin-${el.id}`} min={0} max={40} step={1} value={[el.margin]} onValueChange={(v) => updateQrTextElement(el.id, 'margin', v[0])} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <Button variant="ghost" size="icon" onClick={() => removeQrTextElement(el.id)} className="h-7 w-7"><Trash2 className="text-red-500 h-4 w-4" /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="images" className="pt-4">
                            <ScrollArea className="h-96">
                                <div className="grid gap-4 pr-4">
                                    <Input type="file" ref={qrImageInputRef} onChange={handleQrImageUpload} accept="image/*" className="hidden"/>
                                    <Button onClick={triggerQrImageSelect} variant="outline" size="sm">
                                        <ImagePlus className="mr-2" /> Add Image
                                    </Button>
                                    <div className="grid gap-2">
                                        {qrImageElements.map(el => (
                                            <div key={el.id} className="flex items-center justify-between p-2 border rounded-lg">
                                                <img src={el.url} alt="Uploaded image" className="h-8 w-8 object-cover rounded-md" />
                                                <span className="truncate flex-1 px-2 text-xs text-muted-foreground">Image Element</span>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => removeQrImageElement(el.id)} className="h-7 w-7"><Trash2 className="text-red-500 h-4 w-4" /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                     {isQrImageSelected && (
                                        <div className="grid gap-4 p-4 border rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <Label className="font-bold">Selected Image</Label>
                                                <Button variant="ghost" size="icon" onClick={deleteSelectedElement} className="h-7 w-7">
                                                    <Trash2 className="text-red-500" />
                                                </Button>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Move or resize the selected image on the canvas.</p>
                                        </div>
                                     )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                    {generateCard && <CardOptions />}
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
                   
                   {generateCard ? (
                        <CardOptions />
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
                        <div className="grid gap-2">
                            <Label htmlFor="barcode-margin">Margin ({barcodeMargin}px)</Label>
                            <Slider id="barcode-margin" min={0} max={50} value={[barcodeMargin]} onValueChange={(v) => setBarcodeMargin(v[0])} />
                        </div>
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
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                    style={{ cursor: cursorStyle }}
                />
              ) : (
                <div style={getCanvasDisplaySize()} className="bg-gray-100 flex items-center justify-center text-center text-red-500 rounded-lg p-4">
                    {barcodeError || 'Enter content to generate a code.'}
                </div>
              )}
            </div>
        </div>

      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <div />
        <div className="flex gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setGenerateCard(!generateCard)}
                          className={cn(generateCard && "bg-accent")}
                        >
                            <CreditCard className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Generate on Card</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

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
