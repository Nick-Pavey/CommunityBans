const express = require("express");
const http = require("http");
const app = express();

//This keeps the app "awake" in Glitch
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
//app.listen(process.env.PORT);
setInterval(() => {
  //console.log("wake: " + process.env.PROJECT_DOMAIN);
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 60000);
