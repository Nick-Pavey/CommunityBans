const express = require("express");
const http = require("http");
const fs = require("fs");
const app = express();
const api = require("./OAuth.js");
app.use(express.static("views"));
app.use(express.static(__dirname + "/public"));

//HTML ROUTING

//Home page
app.get("/bantest", function(request, response) {
  response.sendFile(__dirname + "/views/bantest.html");
});

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

//Admin page
app.get("/admin", function(request, response) {
  response.sendFile(__dirname + "/views/admin.html");
});

//Beta Access page
app.get("/beta", function(request, response) {
  response.sendFile(__dirname + "/views/beta.html");
});

//Commmands page
app.get("/commands", function(request, response) {
  response.sendFile(__dirname + "/views/commands.html");
});

//Success page
app.get("/success", function(request, response) {
  response.sendFile(__dirname + "/views/success.html");
});

let listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

//API METHODS

//GET Active User Info
app.get("/users", (req, res, next) => {
  res.json(jsonParse("./userData/activeChannels.json"));
});

//PUT New Active User
app.put("/adduser", function(req, res) {
  const data = {
    userId: req.query.userId,
    communityId: req.query.communityId
  };
  console.log(data);
  try {
    //extra check to see if the ban data is valid
    var obj = require("./userData/activeChannels.json");
    var lastId = 0;
    for (var c in obj.activeChannels) {
      var id = obj.activeChannels[c].id;
      if (id > lastId) {
        lastId = id;
      }
    }
    lastId++;
    console.log(lastId);

    obj["activeChannels"].push({
      username: data.userId,
      id: lastId,
      communityid: data.communityId
    });
    fs.writeFileSync(
      "./userData/activeChannels.json",
      JSON.stringify(obj, null, 2)
    );
  } catch (err) {
    console.log("API/adduser:" + err);
  }
});

//GET Active Channels
app.get("/active", (req, res, next) => {
  res.json(getChannelsToJoin());
});

//GET Banned users log
app.get("/banned", (req, res, next) => {
  res.json(jsonParse("./userData/banned.json"));
});

//GET Banned users log
app.get("/unbanned", (req, res, next) => {
  res.json(jsonParse("./userData/unbanned.json"));
});

//HELPER METHODS

//Get list of channels from "activeChannels.json"
function getChannelsToJoin() {
  //prolly rename this to more accurate use in this file.
  var chnls = [];
  var json = jsonParse("./userData/activeChannels.json");
  for (var c in json.activeChannels) {
    //console.log(json.activeChannels[c].username);
    chnls.push(json.activeChannels[c].username);
  }
  return chnls;
}

//Read, parse, error check, and return data of specified file.
function jsonParse(filepath) {
  try {
    let rawdata = fs.readFileSync(filepath);
    //console.log(JSON.parse(rawdata));
    return JSON.parse(rawdata);
  } catch (err) {
    console.error(err);
    return "jsonParse() failed";
  }
}
