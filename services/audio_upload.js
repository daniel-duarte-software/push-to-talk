"use strict";

const fs = require('fs');
const path = require('path');
const bodyParser = require('./body_parser');

async function processAudioUpload(uploadDir, req, res) {

    const body = await bodyParser(uploadDir, req);
    const { data: { path }, fileType } = body;

    const fileName = audioFileName(fileType);
    const filePath = await renameFileInPlace(path, fileName);
    const url = urlFromFilePath(uploadDir, filePath);

    const result = { url };
    onRequestProcessed(result, res);
}

function audioFileName(fileType) {

    const baseName = new Date().getTime();
    const fileName = `${baseName}.${fileType}`;

    return fileName;
}

async function renameFileInPlace(filePath, newFileName) {
    return new Promise((resolve, _) => {

        const fileDir = path.dirname(filePath);
        const renamedFilePath = path.join(fileDir, newFileName);
        fs.rename(filePath, renamedFilePath, () => {
            resolve(renamedFilePath);
        });
    });
}

function urlFromFilePath(uploadDir, filePath) {

    const basePath = path.basename(uploadDir);
    const fileName = path.basename(filePath);
    const url = path.join(basePath, fileName);

    return url;
}

function onRequestProcessed(result, res) {

    res.writeHead(200, {
        'Access-Control-Allow-Origin': 'http://localhost',
        'Content-Type': 'application/json'
    });

    const resultStr = JSON.stringify(result);
    res.write(resultStr);

    res.end();
}

module.exports = processAudioUpload;
