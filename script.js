const el = id => document.getElementById(id);
const textEl = el('text');
const qrcodeEl = el('qrcode');
const statusEl = el('status');

let qr = null;

function setStatus(msg){ statusEl.textContent = msg; }

function clearQRCode(){
  qrcodeEl.innerHTML = '';
  qr = null;
  setStatus('Cleared');
}

function generateQRCode(){
  const value = textEl.value.trim();
  if(!value){ setStatus('Please enter a URL or text'); return; }

  const size = parseInt(el('size').value, 10) || 256;
  const ec = el('ec').value || 'M';

  clearQRCode();

  qr = new QRCode(qrcodeEl, {
    text: value,
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel[ec]
  });

  setStatus('QR Code generated');
}

function downloadPNG(){
  if(!qr){ setStatus('Generate a QR first'); return; }

  const img = qrcodeEl.querySelector('img');
  const canvas = qrcodeEl.querySelector('canvas');

  if(img){ triggerDownload(img.src); return; }
  if(canvas){ triggerDownload(canvas.toDataURL('image/png')); return; }

  setStatus('Cannot locate QR image');
}

function triggerDownload(dataURL){
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'qr.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setStatus('Downloaded');
}

function copyURL(){
  const value = textEl.value.trim();
  if(!value){ setStatus('Nothing to copy'); return; }

  navigator.clipboard.writeText(value)
    .then(()=> setStatus('URL copied'))
    .catch(()=> setStatus('Copy failed'));
}

el('generate').addEventListener('click', generateQRCode);
el('clear').addEventListener('click', clearQRCode);
el('download').addEventListener('click', downloadPNG);
el('copy').addEventListener('click', copyURL);
textEl.addEventListener('keydown', e => { if(e.key === 'Enter') generateQRCode(); });

window.addEventListener('load', generateQRCode);
