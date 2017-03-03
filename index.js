const express = require("express");
const app = express();
const path = require("path");

const port = 3002;

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use(express.static('public'));

app.listen(port);

console.log("Listening at :%d", port);
