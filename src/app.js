const DB = require("./DB");
const http = require('http');
const express = require("express");
const { raw } = require("express");
const { TIME } = require("sequelize");
const app = express();
const urlencodedParser = express.urlencoded({extended:false});
let isLogin = false; //под логин
const sequelize = DB.sequelize;

app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");

sequelize.sync().then(()=>{
    app.listen(3000);
}).catch(err=>console.log(err));

function checkSignIn(request, response, next){
    if(isLogin){
       next();     //Если сессия существует, перейти дальше
    } else {
       var err = new Error("Not logged in!");
       next(err);  //Печатает ошибку
    }
}

app.get("/", function(request, response){
    response.render("index");
});

app.get("/emergency", checkSignIn, function(request, response){
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

app.get("/edit/emergency/:id", checkSignIn, function(request, response){
    const id = request.params.id;
    const emergency = DB.Emergency.findOne({where: {ID:id}, raw:true, include:{all:true, nested: true}})
    const cargoclass = DB.CargoClassification.findAll({raw:true});
    const cargostate = DB.CargoState.findAll({raw:true});
    const casualties = DB.Casualties.findAll({raw:true});
    const infrastructure = DB.Infrastructure.findAll({raw:true});
    const trainNumber = DB.RepairTrain.findAll({raw:true});
    const railway = DB.Railway.findAll({raw:true});
    Promise.all([emergency, cargoclass, cargostate, casualties, infrastructure, trainNumber, railway])
    .then(data=>{
    console.log(data);
    response.render("edit/emergency", {
        Emergencies:data
    });
    }).catch(err=>console.log(err));
});

app.post("/index", urlencodedParser,  function(request, response){
    const user = request.body.username;
    const pass = request.body.password;
    const userInstance = DB.User.findByPk(user,{ raw:true, include:{all:true}})
    Promise.resolve(userInstance).then(data=>{
        if(data.password == pass)
        {
            isLogin = true;
            response.redirect("/emergency")
        }
        else{
            response.redirect("/")
        }
    }).catch(err=>{
        console.log(err);
        response.redirect("/");
    }     
    )});

app.get("/create/emergency", checkSignIn, function(request, response){

    const cargoclass = DB.CargoClassification.findAll({raw:true});
    const cargostate = DB.CargoState.findAll({raw:true});
    const casualties = DB.Casualties.findAll({raw:true});
    const infrastructure = DB.Infrastructure.findAll({raw:true});
    const trainNumber = DB.RepairTrain.findAll({raw:true});
    const railway = DB.Railway.findAll({raw:true});
    Promise.all([cargoclass, cargostate, casualties, infrastructure, trainNumber, railway])
    .then(data=>{
    console.log(data);
    response.render("create/emergency", {
        Emergencies:data
    });
    }).catch(err=>console.log(err));
});

app.post("/edit/emergency", urlencodedParser, function(request, response){

    if(!request.body) return response.sendStatus(400);

    const id = request.body.id;
    const trainId = request.body.TrainID;
    const cargoclass = request.body.cargoclass;
    const cargostate = request.body.cargostate;
    const casualties = request.body.casualties;
    const infrastructure = request.body.infrastructure;
    const trainNumber = request.body.TrainNumber;
    const geolocation = request.body.geolocation;
    const railway = request.body.railway;

    DB.Emergency.update(
        {TrainID:trainId, cargoclassID: cargoclass, cargostateID: cargostate, casualtyID:casualties,
            repairtrainTrainNumber: trainNumber, Geolocation:geolocation, railwayID: railway, infrastructureID: infrastructure},
        {where: {ID:id}})
    .then(()=>{
        response.redirect("/emergency")
    }).catch(err=>console.log(err));
});

app.post("/create/emergency", urlencodedParser, function(request, response){

    if(!request.body) return response.sendStatus(400);

    const trainId = request.body.TrainID;
    const cargoclass = request.body.cargoclass;
    const cargostate = request.body.cargostate;
    const casualties = request.body.casualties;
    const infrastructure = request.body.infrastructure;
    const trainNumber = request.body.TrainNumber;
    const geolocation = request.body.geolocation;
    const railway = request.body.railway;
    DB.Emergency.create(
        {TrainID:trainId, cargoclassID: cargoclass, cargostateID: cargostate, casualtyID:casualties,
            repairtrainTrainNumber: trainNumber, Geolocation:geolocation, railwayID: railway,
            Time:Date.now(), infrastructureID:infrastructure})
    .then(()=>{
        response.redirect("/emergency")
    }).catch(err=>console.log(err));
});

app.post("/delete/emergency/:id", function(request, response){  
    const id = request.params.id;
    DB.Emergency.destroy({where: {ID: id} }).then(() => {
      response.redirect("/emergency");
    }).catch(err=>console.log(err));
  });