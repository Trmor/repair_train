const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize("RepairTrain", "postgres", "1488", {
    dialect: "postgres",
    host: "localhost",
    define:{
      timestamps:false
}});

const User = sequelize.define("user",{
  userName:{
    type: DataTypes.STRING,
    primaryKey: true,
  },
  password:{
    type: DataTypes.STRING,
    allowNull:false,
  }
});

const Emergency = sequelize.define("emergency",{
  ID:{
    type: DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },
  Geolocation:{
    type: DataTypes.STRING,
  },
  Time:{
    type: DataTypes.DATE,
  },
  TrainID:{
    type: DataTypes.STRING,
  }
});

const RepairTrain = sequelize.define("repairtrain",{
  TrainNumber:{
    type: DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },
  Manager:{
    type: DataTypes.STRING,
    allowNull: false,
  }
});

const Infrastructure = sequelize.define("infrastructure",{
  ID:{
    type: DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },
  State:{
    type: DataTypes.STRING,
    allowNull:false,
  }
});

const Casualties = sequelize.define("casualties",{
  ID:{
    type: DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },
  State:{
    type: DataTypes.STRING,
    allowNull:false,
  }
});

const CargoState = sequelize.define("cargostate",
{
  ID:{
    type: DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },
  State:{
    type: DataTypes.STRING,
    allowNull:false,
  }
});

const CargoClassification = sequelize.define("cargoclass",{
  ID:{
    type: DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },
  Class:{
    type: DataTypes.STRING,
    allowNull:false,
  }
});

const Railway = sequelize.define("railway",{
  ID:{
    type: DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },
  Name:{
    type: DataTypes.STRING,
    allowNull:false,
  }
});

CargoClassification.hasMany(Emergency);
Emergency.belongsTo(CargoClassification);

CargoState.hasMany(Emergency);
Emergency.belongsTo(CargoState);

RepairTrain.hasMany(Emergency);
Emergency.belongsTo(RepairTrain);

Infrastructure.hasMany(Emergency);
Emergency.belongsTo(Infrastructure);

Casualties.hasMany(Emergency);
Emergency.belongsTo(Casualties);

Railway.hasMany(Emergency);
Emergency.belongsTo(Railway);

module.exports = {
    sequelize,
    User,
    Emergency,
    RepairTrain,
    Infrastructure,
    Casualties,
    CargoState,
    CargoClassification,
    Railway
};

