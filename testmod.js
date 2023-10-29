module.exports.config = {
    name: "testmod",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "ShinTHL09",
    description: "Test Modding MetaCord",
    commandCategory: "test",
    usages: "",
    cooldowns: 5,
  };
  module.exports.run = function({ api, event }) {
    console.log("hhi")
    api.getUID("https://www.facebook.com/vuhoang.phat.73", (err, data) => {
        if (err) console.log(err);
        api.sendMessage(data, event.threadID, event.messageID);
    })
  }