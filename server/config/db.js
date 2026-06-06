const mongoose = require("mongoose");
require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("Database connected successfully");
    }).catch((err)=>{ 
        console.error("Error connecting to database:", err);
        process.exit(1);
    });
};

