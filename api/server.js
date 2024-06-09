"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const corsPolicy = cors();
const app = express();
app.use(corsPolicy);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("Express on Vercel"));
app.get("/labels", (req, res) => {
    const labels = require('./labels.json').labels;
    res.json(labels);
});
app.post('/preprocess', (req, res) => {
    // extract query from packet
    // convert to lowercase
    const query = req.body.query.toLowerCase();
    // return error if no query in packet
    if (!query) {
        res.status(400).send('No query provided');
        return;
    }
    const labels = require('./labels.json').labels;
    let recognized_word = '';
    let index = 0;
    for (index = 0; index < labels.length; index++) {
        if (query.includes(labels[index].toLowerCase())) {
            recognized_word = labels[index];
            break;
        }
    }
    // return error empty array if no recognized word or synonyms in classes
    if (!recognized_word) {
        res.json({ imageUrls: [] });
        return;
    }
    // log if valid query
    console.log('Recognized word:', recognized_word, index);
    return res.json({ labels: [index, index, index, index, index, index, index, index] });
});
app.post('/postprocess', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageUrls = req.body.imageUrls;
    function imageUrlToBase64(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch the image as an array buffer
                const response = yield axios.get(url, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data, 'binary');
                // Convert the buffer to a base64 string
                const base64String = buffer.toString('base64');
                return `data:${response.headers['content-type']};base64,${base64String}`;
            }
            catch (error) {
                console.error('Error converting image to base64:', error);
                return null; // Handle error and return null if conversion fails
            }
        });
    }
    try {
        // Convert all image URLs to base64 encoded strings concurrently
        const base64EncodedImages = yield Promise.all(imageUrls.map((url) => imageUrlToBase64(url)));
        // Filter out any null values (in case of errors)
        const validBase64EncodedImages = base64EncodedImages.filter(img => img !== null);
        return res.json({ base64EncodedImages: validBase64EncodedImages });
    }
    catch (error) {
        console.error('Error processing images:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.listen(3000, () => console.log("Server ready on port 3000."));
