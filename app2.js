import express from "express";

const app = express();

// request comes in json format:
app.use(express.json());



app.listen(5001);