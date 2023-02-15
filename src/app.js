const DB = require("./DB");
const http = require('http');
const express = require("express");
const { raw } = require("express");
const app = express();
const urlencodedParser = express.urlencoded({extended:false});
let isLogin = false; //под логин
const sequelize = DB.sequelize;

app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");

sequelize.sync().then(()=>{
    app.listen(3000);
}).catch(err=>console.log(err));

// app.use(function(request, response, next){
//     if(!isLogin && request.path!='/'){//log in system, run before accessing the
//         response.redirect("/");
//     }
//     next();
// });


app.get("/", function(request, response){
    response.render("index");
});

app.get("/emergency", function(request, response){
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

app.get("/edit/emergency/:id", function(request, response){
    const id = request.params.id;
    const emergency = DB.Emergency.findOne({where: {ID:id}, raw:true, include:{all:true, nested: true}})
    const cargoclass = DB.CargoClassification.findAll({raw:true});
    const cargostate = DB.CargoState.findAll({raw:true});
    const casualties = DB.Casualties.findAll({raw:true});
    const trainNumber = DB.RepairTrain.findAll({raw:true});
    const railway = DB.Railway.findAll({raw:true});
    Promise.all([emergency, cargoclass, cargostate, casualties, trainNumber, railway])
    .then(data=>{
    console.log(data);
    response.render("edit/emergency", {
        Emergencies:data
    });
    }).catch(err=>console.log(err));
});

app.get("/login", function(request, response){
    isLogin = true;
    response.redirect("/emergency")
});

app.post("/edit/emergency", urlencodedParser, function(request, response){

    if(!request.body) return response.sendStatus(400);

    const id = request.body.id;
    const trainId = request.body.TrainID;
    const cargoclass = request.body.cargoclass;
    const cargostate = request.body.cargostate;
    const casualties = request.body.casualties;
    const trainNumber = request.body.TrainNumber;
    const geolocation = request.body.geolocation;
    const railway = request.body.railway;

    DB.Emergency.update(
        {TrainID:trainId, cargoclassID: cargoclass, cargostateID: cargostate, casualtyID:casualties,
            repairTrainTrainNumber: trainNumber, Geolocation:geolocation, railwayID: railway},
        {where: {ID:id}})
    .then(()=>{
        response.redirect("/emergency")
    }).catch(err=>console.log(err));
});