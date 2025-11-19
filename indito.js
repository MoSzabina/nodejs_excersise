// server.js - Sablon Node.js szerver

const { getData } = require('./db.js'); // IDE: saját adatlekérő modul
const { uzenetKuldes } = require('./kapcsolat.js'); // IDE: saját kapcsolat/üzenet modul
const { getKapcsolat } = require('./bekuldott.js'); // IDE: saját beküldött üzenet modul
const { crud } = require('./crud.js'); // IDE: saját CRUD modul

const http = require('http');
const fs = require('fs');
const path = require('path');

// Szerver létrehozása
http.createServer((req, res) => {
    let filePath = '.' + req.url;

    // Ha nincs útvonal, index.html betöltése
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html; charset=utf-8'; // Alapértelmezett MIME típus

    // SABLON: adatlekérési útvonal
    if (req.url === '/getData') {
        // IDE: implementáld a saját adatlekérő logikádat
        getData((htmlResult) => {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(htmlResult);
        });
        return;
    }

    // SABLON: beküldött üzenetek lekérdezése
    if (req.url === '/getKapcsolat') {
        getKapcsolat((htmlResult) => {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(htmlResult);
        });
        return;
    }

    // SABLON: üzenetküldés
    if (req.url === '/uzenetKuldes') {
        uzenetKuldes(req, res); // IDE: implementáld a saját logikát
        return;
    }

    // SABLON: CRUD műveletek
    if (req.url.startsWith("/crud")) {
        crud(req, res); // IDE: implementáld a saját CRUD logikát
        return;
    }

    // Statikus fájlok kiszolgálása (HTML, CSS, JS)
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // Hibakezelés: fájl nem található
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - File Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}).listen(8000, () => {
    console.log('szerver fut a http://localhost:8000 címen');
});
