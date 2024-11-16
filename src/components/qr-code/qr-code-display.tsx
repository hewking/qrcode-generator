import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

interface QRCodeDisplayProps {
  value: string
  size?: number
}

const QRCodeDisplay = ({ value, size = 200 }: QRCodeDisplayProps) => {
  const [isHovered, setIsHovered] = useState(false)

  if (!value) return null

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-center p-6 bg-white rounded-xl border-2 border-gray-100 transition-all duration-300 hover:border-blue-200">
        <div className="transform transition-transform duration-300 hover:scale-105">
          <QRCodeSVG
            value={value}
            size={size}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>
      
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl transition-opacity duration-300">
          <button 
            onClick={() => {
              // 这里可以添加下载QR码的功能
              console.log('Download QR Code')
            }}
            className="px-4 py-2 bg-white text-gray-800 rounded-lg transform transition-transform duration-200 hover:scale-105"
          >
            下载二维码
          </button>
        </div>
      )}
    </div>
  )
}

export default QRCodeDisplay 