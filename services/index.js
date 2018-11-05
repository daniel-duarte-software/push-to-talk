"use strict";

const fs = require('fs');
const http = require('http');
const path = require('path');
const processAudioUpload = require('./audio_upload');

const AUDIO_UPLOADS_DIR = path.join(__dirname, "../", "audio_uploads");
fs.existsSync(AUDIO_UPLOADS_DIR) || fs.mkdirSync(AUDIO_UPLOADS_DIR);

http.createServer((req, res) => {

    const { method, url } = req;
    if (method === 'POST' && url === "/audio_upload") {
        processAudioUpload(AUDIO_UPLOADS_DIR, req, res);
    }

}).listen(3000);
