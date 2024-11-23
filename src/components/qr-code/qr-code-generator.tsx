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
import { ThemeToggle } from '@/components/theme/theme-toggle'

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
          user_id: userId ?? '',
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
    <div className="min-h-screen w-full flex flex-col">
      {/* 固定在顶部的导航栏 */}
      <div className="w-full bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4">
            {/* 左侧空白 */}
            <div className="w-10" />
            
            {/* 中间标题 */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground animate-gradient">
                二维码生成器
              </h1>
            </div>
            
            {/* 右侧主题切换按钮 */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
          
          <p className="text-sm sm:text-base text-muted-foreground text-center">
            简单、快速地生成二维码
          </p>
        </div>
      </div>

      {/* 主要内容区域 */}
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
          {/* 装饰背景 */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-150" />
          </div>

          {/* 生成器卡片 */}
          <Card className="relative overflow-hidden border-muted/50 mb-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">生成二维码</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                输入文本或链接，按回车键保存
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="space-y-4">
                <Textarea
                  value={text}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="输入或粘贴文本，按回车保存..."
                  rows={4}
                  className="resize-none text-base"
                />
                
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button 
                    onClick={handlePaste}
                    className="w-full sm:w-auto"
                    variant="default"
                    size="lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ClipboardCopy className="w-4 h-4" />
                      {copied ? '已粘贴' : '粘贴'}
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleClear}
                    className="w-full sm:w-auto"
                    size="lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      清除
                    </span>
                  </Button>
                </div>
              </div>

              {text && (
                <div className="transition-all duration-500 ease-out">
                  <QRCodeDisplay value={text} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 历史记录部分 */}
          <div className="relative">
            <QRHistory
              userId={userId}
              onSelect={(content) => setText(content)}
              eventBus={historyEventBus}
              eventName={HISTORY_UPDATED}
            />
          </div>
        </div>
      </main>

      {/* 底部留白 */}
      <div className="h-16 sm:h-24" />
    </div>
  )
}

export default QRCodeGenerator 