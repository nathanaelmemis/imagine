"use strict";
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("Express on Vercel"));
app.get("/labels", (req, res) => {
    const labels = require('./labels.json').labels;
    console.log(labels);
    res.json(labels);
    // fs.readFile('labels.txt', 'utf8', (err: Error, data: string) => {
    //     if (err) {
    //         console.log(err)
    //         res.status(500).send(`File could not be read!, ${err}`);
    //         return;
    //     }
    //     const labels = data.split('\r\n');
    //     // console.log(labels)
    //     res.json(labels)
    // })
});
app.listen(3000, () => console.log("Server ready on port 3000."));
