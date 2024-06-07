const express = require('express');
const cors = require('cors');

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

app.listen(3000, () => console.log("Server ready on port 3000."));