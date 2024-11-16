import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

const QRCodeDisplay = ({ value, size = 200 }: QRCodeDisplayProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!value) return null;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="flex justify-center p-8 transition-all duration-300 ease-out group-hover:border-primary/20">
        <div className="relative bg-background rounded-xl p-6 shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.02]">
          <QRCodeSVG value={value} size={size} level="H" includeMargin={true} />
        </div>
      </Card>

      <div
        className={`
        absolute inset-0 flex items-center justify-center 
        bg-background/90 backdrop-blur-sm rounded-lg
        transition-all duration-300 ease-out
        ${
          isHovered
            ? "opacity-100 scale-100"
            : "opacity-0 scale-98 pointer-events-none"
        }
      `}
      >
        <Button
          onClick={() => {
            console.log("Download QR Code");
          }}
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
