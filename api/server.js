"use strict";
const express = require('express');
const cors = require('cors');
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
app.listen(3000, () => console.log("Server ready on port 3000."));
