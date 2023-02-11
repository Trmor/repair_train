const DB = require("./DB");
const http = require('http');
const express = require("express");
const app = express();
const urlencodedParser = express.urlencoded({extended:false});
let isLogin = false; //под логин
const sequelize = DB.sequelize;

app.use(express.static(__dirname + "/public"));
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
    DB.Emergency.findAll(
        {
        include:{
            all:true,
            nested:true
        },
        raw:true,
        }
        ).then(data=>{
        console.log(data);
        response.render("emergency", {
            Emergencies:data
        });
    }).catch(err=>console.log(err));  
});

app.get("/login", function(request, response){
    isLogin = true;
    response.redirect("/emergency")
})
