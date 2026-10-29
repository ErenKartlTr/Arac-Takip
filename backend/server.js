const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Simüle edilecek askeri araçlar (Gaziantep civarı koordinatları)
let vehicles = [
  { id: 'KRTL-1', type: 'İHA', lat: 37.0662, lng: 37.3833, speed: 120, battery: 85, status: 'Devriye' },
  { id: 'KRTL-02', type: 'Kara Aracı', lat: 37.0500, lng: 37.3700, speed: 45, battery: 92, status: 'Görevde' }
];

wss.on('connection', (ws) => {
  console.log('Frontend (Ön Yüz) başarıyla bağlandı!');

  // Her 2 saniyede bir araçların konumlarını hafifçe hareket ettir ve frontend'e gönder
  const interval = setInterval(() => {
    vehicles = vehicles.map(v => {
      const latChange = (Math.random() - 0.5) * 0.002;
      const lngChange = (Math.random() - 0.5) * 0.002;
      return {
        ...v,
        lat: Number((v.lat + latChange).toFixed(4)),
        lng: Number((v.lng + lngChange).toFixed(4)),
        battery: Math.max(10, v.battery - (Math.random() > 0.8 ? 1 : 0))
      };
    });

    ws.send(JSON.stringify(vehicles));
  }, 2000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Frontend bağlantısı kesildi.');
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Simülasyon sunucusu http://localhost:${PORT} adresinde çalışıyor.`);
});