const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;