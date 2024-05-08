const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(req.url);
    next();
})

app.get(["/", "/pizza/list"], (req, res) => {
    res.sendFile(__dirname + `/views/index.html`);
})

app.get("/api/pizza", (req, res) => {
    res.sendFile(__dirname +  "/pizzas.json");
})

app.get("/api/allergens", (req, res) => {
    res.sendFile(__dirname +  "/allergens.json");
})

app.get("/api/history", (req, res) => {
    res.sendFile(__dirname +  "/orderHistory.json");
})

app.get("/api/order", (req, res) => {
    res.sendFile(__dirname + "/orderHistory.json");
})

app.post("/api/order", (req, res) => {
    fs.writeFileSync(__dirname + "/orderHistory.json", JSON.stringify(req.body, null, 2))
    res.sendFile(__dirname + "/orderHistory.json");
})
   

app.listen(3000, () => console.log(`http://127.0.0.1:3000`));