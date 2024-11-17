import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Copy, Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

const QRCodeDisplay = ({ value, size = 200 }: QRCodeDisplayProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const qrSize = isMobile ? 160 : size;

  const handleDownload = () => {
    const qrCodeElement = document.querySelector('.qr-code-svg');
    if (!qrCodeElement) return;

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
            
            // 显示下载成功提示
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000);
          }
        }, 'image/png');
      }
    };
    img.src = URL.createObjectURL(svgBlob);
  };

  const handleCopy = async () => {
    const qrCodeElement = document.querySelector('.qr-code-svg');
    if (!qrCodeElement) return;

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
              const clipboardItem = new ClipboardItem({
                'image/png': blob
              });
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

  const handleShare = async () => {
    try {
      if (navigator.share) {
        const canvas = document.createElement('canvas');
        const qrCodeElement = document.querySelector('.qr-code-svg');
        if (!qrCodeElement) return;

        const svgData = new XMLSerializer().serializeToString(qrCodeElement as SVGSVGElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const img = new Image();
        
        img.onload = async () => {
          canvas.width = size * 2;
          canvas.height = size * 2;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob(async (blob) => {
              if (blob) {
                const file = new File([blob], 'qrcode.png', { type: 'image/png' });
                await navigator.share({
                  title: '分享二维码',
                  text: '扫描二维码查看内容',
                  files: [file]
                });
              }
            }, 'image/png');
          }
        };
        img.src = URL.createObjectURL(svgBlob);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!value) return null;

  return (
    <Card className="relative overflow-hidden group">
      <div className="p-6 space-y-6">
        {/* QR码显示 */}
        <div className="relative">
          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-4 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
              <QRCodeSVG 
                value={value} 
                size={qrSize} 
                level="H" 
                includeMargin={true}
                className="qr-code-svg"
              />
            </div>
          </div>

          {/* 操作按钮浮层 */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            "bg-gradient-to-t from-background/80 via-background/50 to-transparent"
          )}>
            <div className="flex flex-col sm:flex-row gap-2 px-4 py-2 rounded-lg bg-background/90 backdrop-blur-sm">
              <Button
                onClick={handleCopy}
                variant="secondary"
                size="sm"
                className={cn(
                  "gap-2 transition-all duration-300",
                  isCopied && "bg-green-500/10 text-green-500"
                )}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownload}
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                下载
              </Button>
              {/* @ts-ignore */}
              {navigator.share && (
                <Button
                  onClick={() => handleShare()}
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  分享
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 移动端固定操作栏 */}
        {isMobile && (
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleCopy}
              variant="secondary"
              size="sm"
              className={cn(
                "gap-2 flex-1 transition-all duration-300",
                isCopied && "bg-green-500/10 text-green-500"
              )}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制
                </>
              )}
            </Button>
            <Button
              onClick={handleDownload}
              variant="secondary"
              size="sm"
              className="gap-2 flex-1"
            >
              <Download className="w-4 h-4" />
              下载
            </Button>
            {navigator.share && (
              <Button
                onClick={handleShare}
                variant="secondary"
                size="sm"
                className="gap-2 flex-1"
              >
                <Share2 className="w-4 h-4" />
                分享
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 操作提示 */}
      <div
        className={cn(
          "absolute top-4 left-1/2 -translate-x-1/2",
          "px-3 py-1.5 rounded-full",
          "bg-background/90 backdrop-blur-sm shadow-lg",
          "text-sm text-foreground",
          "transition-all duration-300",
          showTooltip ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        )}
      >
        操作成功
      </div>
    </Card>
  );
};

export default QRCodeDisplay;
