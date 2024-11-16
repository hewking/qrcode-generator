import { QRCodeSVG } from "qrcode.react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

const QRCodeDisplay = ({ value, size = 200 }: QRCodeDisplayProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDownload = () => {
    const qrCodeElement = document.querySelector('.qr-code-svg');
    if (!qrCodeElement) {
      console.error('QR Code element not found');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(qrCodeElement as SVGSVGElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size * 2;
      canvas.height = size * 2;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qrcode-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      }
    };
    img.src = URL.createObjectURL(svgBlob);
  };

  const handleCopy = async () => {
    const qrCodeElement = document.querySelector('.qr-code-svg');
    if (!qrCodeElement) {
      console.error('QR Code element not found');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(qrCodeElement as SVGSVGElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size * 2;
      canvas.height = size * 2;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              // 创建 ClipboardItem 对象
              const clipboardItem = new ClipboardItem({
                'image/png': blob
              });
              // 复制到剪贴板
              await navigator.clipboard.write([clipboardItem]);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
              console.error('Failed to copy:', err);
            }
          }
        }, 'image/png');
      }
    };
    img.src = URL.createObjectURL(svgBlob);
  };

  if (!value) return null;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="flex justify-center p-8 transition-all duration-300 ease-out group-hover:border-primary/20">
        <div className="relative bg-background rounded-xl p-6 shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.02]">
          <QRCodeSVG 
            value={value} 
            size={size} 
            level="H" 
            includeMargin={true}
            className="qr-code-svg"
          />
        </div>
      </Card>

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-3",
          "bg-background/90 backdrop-blur-sm rounded-lg",
          "transition-all duration-300 ease-out",
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-98 invisible"
        )}
      >
        <Button
          onClick={handleCopy}
          className="gap-2"
          size="lg"
          variant={isCopied ? "secondary" : "default"}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              复制图片
            </>
          )}
        </Button>
        <Button
          onClick={handleDownload}
          className="gap-2"
          size="lg"
          variant="outline"
        >
          <Download className="w-4 h-4" />
          下载图片
        </Button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
