import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Trash2 } from "lucide-react";
import { HistoryService } from "@/lib/services/history.service";
import type { QRHistory as QRHistoryType } from "@/lib/supabase";

interface QRHistoryProps {
  userId: string | null;
  onSelect: (content: string) => void;
}

export const QRHistory = ({ userId, onSelect }: QRHistoryProps) => {
  const [histories, setHistories] = useState<QRHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistories();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>历史记录</span>
      </div>

      {histories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          暂无历史记录
        </div>
      ) : (
        <div className="grid gap-4">
          {histories.map((history) => (
            <Card
              key={history.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelect(history.content)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">
                    {history.title || history.content}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(history.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(history.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
