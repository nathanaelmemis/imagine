"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require('body-parser');
const express = require('express');
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("Express on Vercel"));
app.get("/labels", (req, res) => {
    let usersPath = path_1.default.join(process.cwd(), 'labels.txt');
    let file = fs_1.default.readFileSync('labels.txt');
    console.log(file.toString().split('\r\n'));
    res.json(file.toString().split('\r\n'));
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
