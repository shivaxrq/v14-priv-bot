const { ActivityType } = require("discord.js")
module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    let activities = [`shivapromex`, `shiva deisgn`, `discord.gg/vietnam`, `${client.user.username}`], i = 0;
    setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Streaming, url: `https://twitch.tv/egemenxgul` }), 22000);
  }
};