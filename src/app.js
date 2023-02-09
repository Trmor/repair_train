const http = require('http');
const express = require("express");
const app = express();
app.set("view engine", "hbs");

app.get("/", function(request, response){
    response.render("index.hbs");
});

app.listen(3000);