import { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function CardQRCode() {
  const cardUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return new URL(window.location.pathname, window.location.origin).href
  }, [])

  if (!cardUrl) return null

  return (
    <div className="card-qr">
      <div className="card-qr__code">
        <QRCodeSVG
          value={cardUrl}
          size={88}
          level="M"
          marginSize={0}
          bgColor="#ffffff"
          fgColor="#1a1a1a"
        />
      </div>
      <p className="card-qr__label">Scan to open this card</p>
    </div>
  )
}
