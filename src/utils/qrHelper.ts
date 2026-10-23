import QRCode from 'qrcode';

export function generateUpiUri(
  upiId: string,
  merchantName: string,
  amount: number,
  note: string = 'InstaGrow_Payment'
): string {
  const cleanUpi = upiId.trim();
  const cleanName = merchantName.trim() || 'InstaGrow';
  const cleanAmount = amount.toFixed(2);
  const cleanNote = note.trim().replace(/\s+/g, '_');

  return `upi://pay?pa=${cleanUpi}&pn=${encodeURIComponent(cleanName)}&am=${cleanAmount}&tn=${encodeURIComponent(cleanNote)}&cu=INR`;
}

export async function generateUpiQrDataUrl(
  upiId: string,
  merchantName: string,
  amount: number,
  note: string = 'InstaGrow_Payment'
): Promise<string> {
  const uri = generateUpiUri(upiId, merchantName, amount, note);
  try {
    const dataUrl = await QRCode.toDataURL(uri, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#09090b', // zinc-950
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate UPI QR code:', err);
    return '';
  }
}
