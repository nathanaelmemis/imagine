const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => res.send("Express on Vercel"));

app.get("/labels", (req: any, res: any) => {
    const labels = require('./labels.json').labels
    res.json(labels)
});

app.listen(3000, () => console.log("Server ready on port 3000."));