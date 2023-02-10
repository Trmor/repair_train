const DB = require("./");
const http = require('http');
const express = require("express");
const app = express();
const urlencodedParser = express.urlencoded({extended:false});
let isLogin = false; //под логин
const sequelize = DB.sequelize;

app.set("view engine", "hbs");

sequelize.sync().then(()=>{
    app.listen(3000);
}).catch(err=>console.log(err));

app.get("/", function(request, response){
    response.render("index");
});

app.get("/emergency", function(request, response){
    if(!isLogin){
        response.redirect("/");
    }
    else{
        response.render("emergency");
    }
});
app.get("/login", function(request, response){
    isLogin = true;
    response.redirect("/emergency")
})
