import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { HistoryService } from "@/lib/services/history.service";
import type { QRHistory as QRHistoryType } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface QRHistoryProps {
  userId: string | null;
  onSelect: (content: string) => void;
}

export const QRHistory = ({ userId, onSelect }: QRHistoryProps) => {
  const [histories, setHistories] = useState<QRHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadHistories = async () => {
    try {
      setLoading(true);
      const data = await HistoryService.getHistories(userId);
      setHistories(data || []);
    } catch (error) {
      console.error("Failed to load histories:", error);
      setHistories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await HistoryService.deleteHistory(id);
      setHistories(histories.filter((h) => h.id !== id));
    } catch (error) {
      console.error("Failed to delete history:", error);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (histories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        暂无历史记录
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 移动端标题栏 */}
      <div 
        className={cn(
          "flex items-center justify-between",
          "sticky top-0 bg-background/95 backdrop-blur-sm",
          "py-3 px-4 -mx-4 sm:mx-0 sm:px-0",
          "border-b sm:border-none"
        )}
        onClick={isMobile ? toggleExpand : undefined}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>历史记录</span>
          <span className="text-sm">({histories.length})</span>
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleExpand}>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* 历史记录列表 */}
      <div
        className={cn(
          "grid gap-4 transition-all duration-300",
          isMobile && !isExpanded && "hidden",
          isMobile && "max-h-[60vh] overflow-y-auto"
        )}
      >
        {histories.map((history) => (
          <Card
            key={history.id}
            className={cn(
              "p-4 transition-all duration-200",
              "hover:shadow-md cursor-pointer",
              "active:scale-[0.99]"
            )}
            onClick={() => onSelect(history.content)}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate mb-1">
                  {history.title || history.content}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate">
                    {new Date(history.created_at).toLocaleString()}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-muted text-xs">
                    {history.type}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(history.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 移动端展开/收起提示 */}
      {isMobile && histories.length > 3 && !isExpanded && (
        <button
          onClick={toggleExpand}
          className="w-full text-center py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          查看更多历史记录
        </button>
      )}
    </div>
  );
};
