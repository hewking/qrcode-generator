import { QRCodeSVG } from "qrcode.react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

const QRCodeDisplay = ({ value, size = 200 }: QRCodeDisplayProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;

    // 创建 SVG blob
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    
    // 转换为图片
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size * 2;
      canvas.height = size * 2;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // 设置白色背景
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // 下载 PNG
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
            ref={qrRef}
            value={value} 
            size={size} 
            level="H" 
            includeMargin={true}
          />
        </div>
      </Card>

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "bg-background/90 backdrop-blur-sm rounded-lg",
          "transition-all duration-300 ease-out",
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-98 invisible"
        )}
      >
        <Button
          onClick={handleDownload}
          className="gap-2"
          size="lg"
        >
          <Download className="w-4 h-4" />
          下载二维码
        </Button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
