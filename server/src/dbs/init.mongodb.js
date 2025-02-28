"use strict"
const mongoose = require("mongoose")
require("dotenv").config();
const connectUrl = process.env.MONGODB_URL

class Database {
    constructor() {
        this.connect()
    }
    connect(type = "mongodb") {
        // tắt log
        // if (1 === 1) { 
        //     mongoose.set("debug", false)
        //     mongoose.set("debug", { color: true })
        // }
        mongoose.connect(connectUrl).then(() => console.log("✅ connected successfully!"))
            .catch(() => console.log("connection failed!"))
    }
    //   only init 1 connect
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb