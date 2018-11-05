"use strict";

const formidable = require('formidable');

module.exports = async (uploadDir, req) => {
    return new Promise((resolve, _) => {

        const form = new formidable.IncomingForm({ uploadDir });
        form.parse(req, (_, fields, files) => {

            const body = { ...fields, ...files };
            resolve(body);
        });
    });
};
