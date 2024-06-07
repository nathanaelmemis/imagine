const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => res.send("Express on Vercel"));

app.get("/labels", (req: any, res: any) => {
    fs.readFile('labels.txt', 'utf8', (err: Error, data: string) => {
        if (err) {
            console.log(err)
            res.status(500).send(`File could not be read!, ${err}`);
            return;
        }

        const labels = data.split('\r\n');

        console.log(labels)
        res.json(labels)
    })
});

app.listen(3000, () => console.log("Server ready on port 3000."));