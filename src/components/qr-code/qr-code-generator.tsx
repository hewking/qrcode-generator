'use client'

import { useState } from 'react'
import Button from '../ui/button'
import TextArea from '../ui/textarea'
import QRCodeDisplay from './qr-code-display'
import { handleClipboardRead } from '@/lib/utils'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">二维码生成器</h1>
          <p className="text-gray-600">输入文本或链接，即刻生成二维码</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl p-6 space-y-6">
          <div className="space-y-4">
            <TextArea
              value={text}
              onChange={handleInputChange}
              placeholder="请输入或粘贴文本..."
              rows={4}
            />
            
            <div className="flex gap-3 justify-end">
              <Button 
                onClick={handlePaste}
                className="group relative"
              >
                {copied ? '已粘贴!' : '粘贴'}
                <span className={`
                  absolute -top-8 left-1/2 transform -translate-x-1/2 
                  bg-gray-800 text-white text-sm px-2 py-1 rounded 
                  transition-opacity duration-200
                  ${copied ? 'opacity-100' : 'opacity-0'}
                `}>
                  已复制到输入框
                </span>
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleClear}
                className="transition-all duration-200 hover:scale-105"
              >
                清除
              </Button>
            </div>
          </div>

          <div className={`
            transition-all duration-500 ease-in-out
            ${text ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}
          `}>
            <QRCodeDisplay value={text} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRCodeGenerator 