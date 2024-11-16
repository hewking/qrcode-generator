'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import QRCodeDisplay from './qr-code-display'
import { handleClipboardRead } from '@/lib/utils'
import { ClipboardCopy, Trash2 } from 'lucide-react'

const QRCodeGenerator = () => {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto relative">
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
              输入文本或链接，即可生成对应的二维码
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <Textarea
                value={text}
                onChange={handleInputChange}
                placeholder="输入或粘贴文本..."
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
                  <span className={`
                    absolute -top-12 left-1/2 transform -translate-x-1/2 
                    bg-popover text-popover-foreground text-sm px-3 py-1.5 rounded-lg
                    transition-all duration-300 ease-out
                    ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
                  `}>
                    已复制到输入框
                    <svg className="absolute h-2 w-4 text-popover -bottom-2 left-1/2 transform -translate-x-1/2" fill="currentColor" viewBox="0 0 16 8">
                      <path d="M0 0H16L8 8L0 0Z" />
                    </svg>
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
      </div>
    </div>
  )
}

export default QRCodeGenerator 