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

app.post('/preprocess', (req: any, res: any) => {
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
    console.log('Recognized word:', recognized_word, index);

    return res.json({ labels: [index, index, index, index, index, index, index, index] }); 
});

app.post('/postprocess', async (req: any, res: any) => {
    const imageUrls = req.body.imageUrls;

    async function imageUrlToBase64(url: string) {
        try {
            // Fetch the image as an array buffer
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            
            // Convert the buffer to a base64 string
            const base64String = buffer.toString('base64');
            return `data:${response.headers['content-type']};base64,${base64String}`;
        } catch (error) {
            console.error('Error converting image to base64:', error);
            return null; // Handle error and return null if conversion fails
        }
    }

    try {
        // Convert all image URLs to base64 encoded strings concurrently
        const base64EncodedImages = await Promise.all(imageUrls.map((url: string) => imageUrlToBase64(url)));

        // Filter out any null values (in case of errors)
        const validBase64EncodedImages = base64EncodedImages.filter(img => img !== null);

        return res.json({ base64EncodedImages: validBase64EncodedImages });
    } catch (error) {
        console.error('Error processing images:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(3000, () => console.log("Server ready on port 3000."));