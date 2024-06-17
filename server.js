const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const exp = require('constants');
// const { renderUnicodeSuitSymbol } = require('./src/gameLogic/poker/utils/ui.jsx');
// console.log("it works");

require('dotenv').config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + '/build'));

// const server = http.createServer(app);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/api', (req, res) => {
    // console.log("it works fpr /");
    res.send("it works !");
    // res.json({ message: 'Hello from Express!' });
});

// app.get('* ', (req, res) => {
//     res.sendFile(__dirname + '/build/index.html');
// });

app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
})