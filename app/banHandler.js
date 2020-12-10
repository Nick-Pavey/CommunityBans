const tmi = require("tmi.js");
const fs = require("fs");

// All of these functions will be useable when the file is "required"

module.exports = {
  ban: function(client, invchannel, invoker, userToBan, reasonToBan) {
    try {
      //Do the actual banning
      var channelname = invchannel.replace("#", "");
      var groupname = getGroup(invchannel.replace("#", ""));
      var usersingroup = getAllChannelsInGroup(groupname);

      //foreach channel in the group
      for (var c in usersingroup) {
        console.log("#" + usersingroup[c]);

        client.ban("#" + usersingroup[c], userToBan, reasonToBan).then(data => {
          //whisper the data: does not work, and may not until the bot is approved
          //client.whisper("StickWiddit", "Banned: " + data).then(data => {}).catch(err => {console.log(err)});
        });
      }

      client.say(invchannel, "Banned: " + userToBan + ", from: " + groupname);

      //log the bans to JSON file.
      //extra check to see if the ban data is valid
      if (userToBan != "") {
        //Format the username for logging
        userToBan = userToBan.replace("@", "");

        var obj = require("./userData/banned.json");

        obj["banned"].push({
          username: userToBan,
          bannedby: invoker,
          channel: channelname,
          reason: reasonToBan,
          time: Date(),
          community: groupname
        });
        fs.writeFile(
          "./userData/banned.json",
          JSON.stringify(obj, null, 2),
          function(err) {
            console.log(err);
          }
        );
        //add the user to the banned API list.
        //ajaxPUT(userToBan, invoker, channelname, reasonToBan, groupname); 
        //probably move this to a different file that works well with ajax calls
      }
    } catch (err) {
      console.log("CAUGHT:" + err);
    }

    function ajaxPUT(username, invoker, channel, reason, communityId) {
      console.log("Ban " + username + " For " + reason);
      $.ajax({
        url:
          "https://communitybansapi.glitch.me/banuser?username=" +
          username +
          "&invoker=" +
          invoker +
          "&channel=" +
          channel +
          "&reason=" +
          reason +
          "&communityId=" +
          communityId,
        type: "PUT"
      }).catch(function(err) {
        console.log(err);
      });
      return;
    }
  },

  //UNBAN
  unban: function(client, invchannel, invoker, userToUnBan) {
    try {
      //Do the actual banning
      var channelname = invchannel.replace("#", "");
      var groupname = getGroup(invchannel.replace("#", ""));
      var usersingroup = getAllChannelsInGroup(groupname);

      //foreach channel in the group
      for (var c in usersingroup) {
        console.log("#" + usersingroup[c]);
        //console.log(userToBan);

        client.unban("#" + usersingroup[c], userToUnBan).then(data => {});
      }

      client.say(
        invchannel,
        "Unbanned: " + userToUnBan + ", from: " + groupname
      );

      //log the bans to JSON file.
      //extra check to see if the ban data is valid
      if (userToUnBan != "") {
        //Format the username for logging
        userToUnBan = userToUnBan.replace("@", "");

        var obj = require("./userData/unbanned.json");

        obj["unbanned"].push({
          username: userToUnBan,
          bannedby: invoker,
          channel: channelname,
          time: Date(),
          community: groupname
        });
        fs.writeFile(
          "./userData/unbanned.json",
          JSON.stringify(obj, null, 2),
          function(err) {
            console.log(err);
          }
        );
      }
    } catch (err) {
      console.log("CAUGHT:" + err);
    }
  }
};

//Helper methods, only can be called within this file

//Get current group of user
function getGroup(username) {
  var json = jsonParse("./userData/activeChannels.json");
  for (var c in json.activeChannels) {
    if (json.activeChannels[c].username === username) {
      return json.activeChannels[c].communityid;
    }
  }
  return ""; //Should only get here if no names match.
}

//Get all channels in given group
function getAllChannelsInGroup(groupname) {
  var channels = jsonParse("./userData/activeChannels.json");
  var chlist = [];
  for (var u in channels.activeChannels) {
    if (channels.activeChannels[u].communityid === groupname) {
      chlist.push(channels.activeChannels[u].username.toString());
    }
  }
  return chlist;
}

//Read, parse, and return data of specified file.
function jsonParse(filepath) {
  try {
    let rawdata = fs.readFileSync(filepath);
    //console.log(JSON.parse(rawdata));
    return JSON.parse(rawdata);
  } catch (err) {
    console.error("CAUGHT: " + err);
    return " ";
  }
}
