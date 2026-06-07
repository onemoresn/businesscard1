import { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function CardQRCode() {
  const [cardUrl, setCardUrl] = useState('')

  useEffect(() => {
    setCardUrl(new URL(window.location.pathname, window.location.origin).href)
  }, [])

  if (!cardUrl) return null

  return (
    <div className="card-qr">
      <div className="card-qr__code">
        <QRCodeCanvas
          value={cardUrl}
          size={88}
          level="M"
          marginSize={1}
          bgColor="#ffffff"
          fgColor="#1a1a1a"
        />
      </div>
      <p className="card-qr__label">Scan to open this card</p>
    </div>
  )
}
