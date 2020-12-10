const express = require("express");
const tmi = require("tmi.js");
const http = require("http");
const fs = require("fs");
const app = express();
var banHandler = require("./banHandler.js");
const wakeModule = require("./wake.js");
const api = require("./API.js");
var CHANNELS = getChannelsToJoin();

// Glitch expects a web server so we're starting express in API.js

// Setting options for the bot, disable debug output once up and running.
let options = {
  options: {
    debug: process.env.DEBUG
  },
  connection: {
    cluster: "aws",
    reconnect: true
  },
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  },
  channels: CHANNELS
};

// Set up the new TMI client and connect to the server.
let client = new tmi.client(options);
client.connect();

// Connect to the server, log the connection
client.on("connected", (address, port) => {
  console.log(`Connected to ${address}:${port}`);
});

// Monitor chat, and call matching functions
client.on("chat", (channel, user, message, self) => {
  //ignore all messages from itself
  if (self) return;

//Public Commands
  //bot info
  if (message == "!cb" || message.startsWith("!communitybans")) {
    client.say(
      channel,
      "I'm a bot (in development) by twitter.com/StickWiddit to allow streamers to ban users in multiple channels of fellow streamers."
    );
  }
  //bot commands
  if (message == "!cbcommands") {
    client.say(
      channel,
      "Commands can be found here: https://communitybans.glitch.me/commands"
    );
  }
  
//Mod Commands

  //ban command, goes to banHandler.js
  if (
    message.startsWith("!cban") &&
    (user.mod === true || isAdmin(user) || isBroadcaster(channel, user))
  ) {
    var parameters = message.split(" ");
    if (parameters.length > 2) {
      var userToBan = parameters[1];
      var reasonToBan = parameters
        .slice(2, 30)
        .toString()
        .replace(",", " ");

    //client.say(channel, `@${user.username}` + " Community Ban " + userToBan + " for: " + reasonToBan + "? (y/n)");
    } else {
      client.say(
        channel,
        `@${user.username}` + ", Usage: !cban Username Reason"
      );
    }
    console.log(parameters);
    //call the ban handler, given the channel of the action as well as the user who invoked the command
    banHandler.ban(client, channel, user.username, userToBan, reasonToBan);
  }
  
  //UNban command, goes to banHandler.js
  if (
    message.startsWith("!cunban") &&
    (user.mod === true || isAdmin(user) || isBroadcaster(channel, user))
  ) {
    var parameters = message.split(" ");
    if (parameters.length > 1) {
      var userToUnBan = parameters[1];
    } else {
      client.say(
        channel,
        `@${user.username}` + ", Usage: !cunban Username"
      );
    }
    console.log(parameters);
    //call the ban handler, given the channel of the action as well as the user who invoked the command
    banHandler.unban(client, channel, user.username, userToUnBan);
  }
  

  //ChannelOwner Commands

  //Broadcster confirmation
  if (message === "!cbroadcaster?" && isBroadcaster(channel, user)) {
    client.say(channel, "You are the registered broadcaster.");
  }

  //Admin Commands

  //Global ban
  if (message.startsWith("!globalban") && isAdmin(user)) {
    client.say(
      channel,
      `@${user.username}, want to ban this user from all participating channels? (y/n)`
    );
  }

  //cbadmin confirmation
  if (message.toLowerCase() === "!cbadmin?") {
    if (isAdmin(user)) {
      client.say(channel, `@${user.username} is an Administrator.`);
    } else {
      client.say(channel, "You are not an Administrator.");
    }
  }
});

//HELPER METHODS

//Get list of channels from "activeChannels.json"
function getChannelsToJoin() {
  var chnls = [];
  var json = jsonParse("./userData/activeChannels.json");
  for (var c in json.activeChannels) {
    //console.log(json.activeChannels[c].username);
    // TODO: if the username is active add to list, if not skip.
    chnls.push(json.activeChannels[c].username);
  }
  return chnls;
}

//Check to see if the user is the broadcaster
function isBroadcaster(channel, user) {
  try {
    var streamer = channel.replace("#", "");
    if (streamer === user.username) {
      return true;
    } else return false;
  } catch (err) {
    console.error(err);
  }
}

//Check to see if user is listed in admins.json
function isAdmin(user) {
  var admins = jsonParse("./userData/admins.json");
  for (var a in admins.admins) {
    //console.log(admins.admins[a].username);
    if (admins.admins[a].username === user.username) {
      return true;
    }
  }
  return false; //Should only get here if no names match.
}

//Read, parse return data of specified file.
function jsonParse(filepath) {
  try {
    let rawdata = fs.readFileSync(filepath);
    //console.log(JSON.parse(rawdata));
    return JSON.parse(rawdata);
  } catch (err) {
    console.error(err);
    return " ";
  }
}
