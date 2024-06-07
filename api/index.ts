const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: any, res: any) => {
  res.send('Express + TypeScript Server');
});

const port = 3000
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});