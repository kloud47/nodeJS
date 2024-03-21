import express from "express";
import zod from "zod";
const app = express();

const schema = zod.array(zod.number());// array of number validation check
// another example of zod:
const schema2 = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8)
})

let TotalRequest = 0;

app.use(express.json());

function calculateRequest(req, res, next) {
    console.log(TotalRequest);
    TotalRequest++;
    next();
}
// middleware for all requests:----------------------------------------->
// app.use(calculateRequest);

// request specific middleware:
app.get('/ok', calculateRequest, (req, res) => {
    res.status(200).json({
        TotalRequest: TotalRequest
    });
});

app.post('/arr', calculateRequest, (req, res) => {
    const array = req.body.ans;
    // const ansCheck = schema.Parse(array);
    const ansCheck = schema.safeParse(array);
    const len = ansCheck.data.length;
    if (!ansCheck.success) {
        res.status(400).send("input is invalid");
    }
    res.status(200).send("you have array length " + len);
});

// passing params to middleware:
const greet = (greet) => {
    return (req, res) => {
        res.send(greet + " to you");
    }
}
app.get('/greet', greet("Hi"));

// global catches:------------------------------------------->
app.use((err, req, res, next) => {
    res.status(400).json({
        msg: "Sorry something is wrong with our server."
    });
});

app.listen('5000');