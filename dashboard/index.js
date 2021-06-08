const express = require("express");
const path = require('path');
const app = express();

app.use(express.static('dist'));
app.set("public", path.join(__dirname, "dist"));

app.get('*', (request, response) => {
    response.sendFile(`${__dirname}/dist/index.html`);
});

app.listen(8080, () => {
    console.log(`Server is booming on port 8080`);
});