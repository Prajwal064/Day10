require("dotenv").config({ path: "./src/.env" });
   
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app =  require ("./src/app.js")

const connectToDB = require("./src/config/database")




connectToDB()

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})
