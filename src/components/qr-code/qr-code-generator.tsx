'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import QRCodeDisplay from './qr-code-display'
import { handleClipboardRead } from '@/lib/utils'
import { ClipboardCopy, Trash2 } from 'lucide-react'
import { QRHistory } from './qr-history'
import { HistoryService } from '@/lib/services/history.service'
import { useUserId } from '@/hooks/useUserId'

// 创建一个事件总线实例
const historyEventBus = new EventTarget();
export const HISTORY_UPDATED = 'historyUpdated';

const QRCodeGenerator = () => {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const userId = useUserId();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    setCopied(false)
  }

  const handleClear = () => {
    setText('')
    setCopied(false)
  }

  const handlePaste = async () => {
    const clipboardText = await handleClipboardRead()
    if (clipboardText) {
      setText(clipboardText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 处理键盘事件
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 当按下回车键且没有按住 Shift 键时
    if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
      e.preventDefault() // 阻止默认的换行行为
      try {
        const newHistory = await HistoryService.createHistory({
          user_id: userId,
          content: text,
          title: text.slice(0, 50),
          type: text.startsWith('http') ? 'url' : 'text'
        })
        
        // 触发历史记录更新事件
        historyEventBus.dispatchEvent(new CustomEvent(HISTORY_UPDATED, {
          detail: newHistory
        }));
      } catch (error) {
        console.error('Failed to save history:', error)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto relative">
        <div className="absolute -top-20 -left-20 w-40 h-40 sm:-top-40 sm:-left-40 sm:w-80 sm:h-80 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 sm:-bottom-40 sm:-right-40 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-200/20 to-green-200/20 rounded-full blur-3xl animate-pulse delay-150" />
        
        <div className="text-center mb-8 sm:mb-16 space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground animate-gradient">
            二维码生成器
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto">
            简单、快速地生成二维码
          </p>
        </div>
        
        <Card className="relative overflow-hidden border-muted/50">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">生成二维码</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              输入文本或链接，按回车键保存
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <Textarea
                value={text}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="输入或粘贴文本，按回车保存..."
                rows={4}
                className="resize-none text-base sm:text-lg"
              />
              
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button 
                  onClick={handlePaste}
                  className="group relative w-full sm:w-auto"
                  variant="default"
                  size="lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ClipboardCopy className="w-4 h-4 transition-transform duration-300 ease-out group-hover:scale-110" />
                    {copied ? '已粘贴' : '粘贴'}
                  </span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="group w-full sm:w-auto"
                  size="lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4 transition-transform duration-300 ease-out group-hover:scale-110" />
                    清除
                  </span>
                </Button>
              </div>
            </div>

            <div className={`
              transition-all duration-500 ease-out
              ${text ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}>
              <QRCodeDisplay value={text} />
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <QRHistory
            userId={userId}
            onSelect={(content) => setText(content)}
            eventBus={historyEventBus}
            eventName={HISTORY_UPDATED}
          />
        </div>
      </div>
    </div>
  )
}

export default QRCodeGenerator 