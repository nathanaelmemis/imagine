"use strict";
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("Express on Vercel"));
app.get("/labels", (req, res) => {
    // // Function to read and parse the file
    // function parseTextFile(filePath) {
    //     fs.readFile(filePath, 'utf8', (err, data) => {
    //         if (err) {
    //             console.error("File could not be read!", err);
    //             return;
    //         }
    //         // Split the content by newlines
    //         const lines = data.split('\n');
    //         // Output the array of lines
    //         console.log(lines);
    //     });
    // }
    // // Example usage:
    // // Replace 'path/to/your/file.txt' with the actual file path
    // const filePath = 'path/to/your/file.txt';
    // parseTextFile(filePath);
});
app.listen(3000, () => console.log("Server ready on port 3000."));
