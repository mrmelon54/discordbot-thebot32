require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const algebra = require("algebra.js");
const http = require("http");
const { exec } = require("child_process");
const ytdl = require("ytdl-core");
const glob = require("glob");
const gitDownload = require("download-git-repo");
const validUrl = require("valid-url");

const streamOptions = { seek: 0, volume: 1 };

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  updateStatus();
  var g = client.guilds.resolve(mainserverguild);
  if (g == undefined) return;
  g.members.fetch().then(x => {
    x.forEach(y =>
      updateMemberNickname(y)
    );
  });
});

var mainserverguild = "665185910060613653";
var rolesymbols = [
  { symbol: "♔", id: 684873374022893579 },
  { symbol: "♕", id: 684873801036464183 },
  { symbol: "♖", id: 691745309268901938 },
  { symbol: "♗", id: 665187167395512330 },
  { symbol: "♘", id: 665266090019913729 },
  { symbol: "♙", id: 690619454169546773 },
  { symbol: "✾", id: 683727914134667337 },
  { symbol: "★", id: 692286610229821460 },
  { symbol: "☆", id: 683381997145686024 },
  { symbol: "✦", id: 692286144775454740 },
  { symbol: "◊", id: 692149252683595875 },
  { symbol: "⇪", id: 683378603924521014 }
];
client.on("guildMemberUpdate", (o, n) => {updateMemberNickname(n)});

function updateMemberNickname(n) {
  if (n.guild.id.toString() === mainserverguild) {
    if (n.user.bot) return;
    var symbols = rolesymbols
      .map(y => (n.roles.cache.some(x => x.id == y.id) ? y.symbol : null))
      .filter(x => x != null)
      .join(" ");
    var name = n.displayName.replace(/[♔♕♖♗♘♙✾★☆✦◊⇪⊲⊳]/g, "").trim();
    if (symbols == undefined) return;
    if (name == undefined) return;
    var uname = "⊲ " + symbols + " " + name + " ⊳";
    console.log("Updated " + n.user.tag + " nickname to " + uname);
    if (uname == n.nickname) return;
    if (uname == undefined) return;
    n.setNickname(uname)
      .then(() => {})
      .catch(() => {});
  }
}

function commandParser(_a) {
  var _o = {
    result: false,
    output: [""],
    isCmd: false
  };
  var strOpen = false;
  var strChar = "";
  for (var i = 0; i < _a.length; i++) {
    if (i == 0 && _a[i] == "<") {
      _o.isCmd = true;
      continue;
    }
    if (!strOpen && (_a[i] == '"' || _a[i] == "'")) {
      strChar = _a[i];
      strOpen = true;
      continue;
    }
    if (strOpen && _a[i] == strChar) {
      strOpen = false;
      continue;
    }
    if (!strOpen && _a[i] == " ") {
      _o.output.push("");
      continue;
    }
    _o.output[_o.output.length - 1] += _a[i];
  }
  if (!strOpen) _o.result = true;
  return _o;
}

function updateStatus() {
  client.user.setStatus(config.AboutMe.status.status);
  client.user.setActivity(config.AboutMe.status.activity, {
    type: config.AboutMe.status.presence.toUpperCase()
  });
}

client.on("message", async msg => {
  if (msg.author.bot) return;
  var cp = commandParser(msg.content);
  if (cp.isCmd) {
    var cmd = cp.output;
    if (cmd[0] == "emote" && cmd.length == 2) {
      msg.channel.send(
        client.emojis
          .find(
            x =>
              x.name
                .toLowerCase()
                .replace(/_/g, "")
                .replace(/-/g, "") ==
              cmd[1]
                .toLowerCase()
                .replace(/_/g, "")
                .replace(/-/g, "")
          )
          .toString()
      );
    }
  } else {
    if (msg.content.trim().toLowerCase() == "hello") {
      msg.channel.send("Hello " + msg.member.displayName);
    }
  }
});

function playSong(vc, song) {
  vc.join().then(conn => {
    const stream = ytdl(`https://www.youtube.com/watch?v=${song}`, {
      filter: "audioonly"
    });
    const dispatcher = conn.playStream(stream, streamOptions);
    dispatcher.on("end", end => {
      vc.leave();
    });
  });
}

client.on("error", err =>
  client.guilds
    .get("584382438688555019")
    .channels.get("593476194209366017")
    .send("<@&590198302918836240> __**Error**__\n" + JSON.stringify(err))
);
client.on("warn", err =>
  client.guilds
    .get("584382438688555019")
    .channels.get("593476194209366017")
    .send("<@&590198302918836240> __**Warn**__\n" + JSON.stringify(err))
);

client.login(process.env.TOKEN);
