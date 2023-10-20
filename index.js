import express from "express";
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 8000;
const secretKey = "secretKey"

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to the Home page!"
    })
})

app.post('/login', (req, res) => {
    const user = {
        id: 1,
        username: "HammadDev",
        email: "hammadurehman700@gmail.com",
    }
    jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
        res.status(200).json({
            token
        })
    })
})



const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader != undefined) {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next()
        console.log("split====>>>>>", bearer);
    } else {
        res.status(404).json({
            message: "Invalid Token"
        })
    }
}

app.post("/profile", verifyToken, (req, res) => {
    console.log("req headers====>>>>", req.headers);
    console.log("autherization====>>>>", req.headers['authorization']);

    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.status(400).json({
                message: "Invalid Token"
            })
        } else {
            res.status(200).json({
                message: "Profile accessed",
                data: authData
            })
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})