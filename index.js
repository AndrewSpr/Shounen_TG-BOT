const TOKEN = "5625717603:AAEM-f_lKhTX_CbiU-gwTT_4Dhpxd5DFumQ";
const TELEGRAM_API = require("node-telegram-bot-api");
const { messageTypes } = require("node-telegram-bot-api/src/telegram");
const { options } = require("nodemon/lib/config");

const BOT = new TELEGRAM_API(TOKEN, { polling: true });

BOT.setMyCommands([{ command: "", description: "" }]);

BOT.on("message", async (msg) => {
    const text = msg.text
    const chaitId = msg.from.id

  if (msg.hasOwnProperty('entities') === true ) {
      let entitiesLength = msg.entities[0].length
     BOT.sendMessage(chaitId, `hello, length ${msg.}`)
  }

});
