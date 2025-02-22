require("dotenv").config();
const app = require("./src/app");
const server = app.listen(process.env.PORT || 4000, () => {
    console.log("Server success!")
})

// Stop run
process.on("SIGINT", () => {
    server.close(() => console.log("Exit server"))
})