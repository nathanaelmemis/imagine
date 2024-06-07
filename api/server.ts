const express = require('express');
const cors = require('cors');
const axios = require('axios');

const corsPolicy = cors();

const app = express();
app.use(corsPolicy);
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => res.send("Express on Vercel"));

app.get("/labels", (req: any, res: any) => {
    const labels = require('./labels.json').labels
    res.json(labels)
});

app.post('/generate', async (req: any, res: any) => {
    // extract query from packet
    // convert to lowercase & split by spaces
    const query = req.body.query.toLowerCase().split(' ');

    // return error if no query in packet
    if (!query) {
        res.status(400).send('No query provided');
        return
    }

    const labels = require('./labels.json').labels

    let recognized_word = ''
    let index = 0
    for (index = 0; index < labels.length; index++) {
        if (query.includes(labels[index].toLowerCase())) {
            recognized_word = labels[index];
            break;
        }
    }

    // return error empty array if no recognized word or synonyms in classes
    if (!recognized_word) {
        res.json({ imageUrls: [] });
        return
    }

    // log if valid query
    console.log('Generating images for query:', recognized_word);

    // const generatedImagesPromise = axios.post('https://imagine.automos.net/label/generate', { labels: [index, index, index, index] });
    const generatedImagesPromise = ['awdawdawdwa']

    return res.json(generatedImagesPromise); // array(16) of image URLs
});

app.listen(3000, () => console.log("Server ready on port 3000."));