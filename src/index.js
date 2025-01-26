const express = require("express");
const app = express();
const port = 3000;

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
	res.send("MOI APP API");
});

app.get("/healthz", (req, res) => {
	res.send("Running successfully");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
