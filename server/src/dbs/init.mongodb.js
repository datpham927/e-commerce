"use strict"
const mongoose = require("mongoose")
const connectUrl = "mongodb+srv://11111111:dn2yTO8JJTXY8rev@cluster0.nto34.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
class Database {
    constructor() {
        this.connect()
    }
    connect(type = "mongodb") {
        if (1 === 1) {
            mongoose.set("debug", true)
            mongoose.set("debug", { color: true })
        }
        mongoose.connect(connectUrl).then(() => console.log("connected successfully!"))
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