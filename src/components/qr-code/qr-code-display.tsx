import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  
  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const qrSize = isMobile ? 160 : size;

  // 修改触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // 防止触摸事件冒泡
    if (!isHovered) {
      setIsHovered(true);
    }
  };

  const handleClosePanel = () => {
    setIsHovered(false);
  };

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
    <div className="relative group touch-manipulation">
      {/* QR码显示区域 - 仅在面板关闭时可点击 */}
      <div 
        className={cn("relative", !isHovered && "cursor-pointer")}
        onClick={() => !isHovered && setIsHovered(true)}
        onTouchStart={(e) => !isHovered && handleTouchStart(e)}
      >
        <Card className="flex justify-center p-4 sm:p-8 transition-all duration-300 ease-out group-hover:border-primary/20">
          <div className="relative bg-background rounded-xl p-4 sm:p-6 shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.02]">
            <QRCodeSVG 
              value={value} 
              size={qrSize} 
              level="H" 
              includeMargin={true}
              className="qr-code-svg"
            />
          </div>
        </Card>

        {/* 移动端显示提示文本 */}
        {isMobile && !isHovered && (
          <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
            <span className="text-sm text-muted-foreground bg-background/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
              点击查看操作选项
            </span>
          </div>
        )}
      </div>

      {/* 操作面板 */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 sm:absolute sm:inset-0",
          "flex flex-col items-center justify-end sm:justify-center gap-3",
          "bg-gradient-to-t from-background/95 to-background/80 sm:bg-background/90",
          "backdrop-blur-sm rounded-t-3xl sm:rounded-lg",
          "transition-all duration-300 ease-out p-6 sm:p-4",
          "z-50", // 确保面板在最上层
          isHovered 
            ? "translate-y-0 opacity-100 pointer-events-auto" 
            : "translate-y-full sm:translate-y-0 opacity-0 pointer-events-none"
        )}
      >
        {/* 移动端关闭按钮 */}
        {isMobile && (
          <button
            type="button"
            onClick={handleClosePanel}
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-8 flex flex-col items-center justify-center"
            aria-label="关闭操作面板"
          >
            <div className="w-12 h-1 bg-muted rounded-full" />
          </button>
        )}
        
        <div className="w-full max-w-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-4">
          <Button
            onClick={(e) => {
              e.stopPropagation(); // 防止事件冒泡
              handleCopy();
            }}
            className="h-12 sm:h-10 text-base sm:text-sm gap-2 w-full sm:w-auto"
            size={isMobile ? "lg" : "default"}
            variant={isCopied ? "secondary" : "default"}
          >
            {isCopied ? (
              <>
                <Check className="w-5 h-5 sm:w-4 sm:h-4" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 sm:w-4 sm:h-4" />
                复制图片
              </>
            )}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation(); // 防止事件冒泡
              handleDownload();
            }}
            className="h-12 sm:h-10 text-base sm:text-sm gap-2 w-full sm:w-auto"
            size={isMobile ? "lg" : "default"}
            variant="outline"
          >
            <Download className="w-5 h-5 sm:w-4 sm:h-4" />
            下载图片
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
