const TOKEN = "5625717603:AAEM-f_lKhTX_CbiU-gwTT_4Dhpxd5DFumQ";
const TELEGRAM_API = require("node-telegram-bot-api");
const { messageTypes } = require("node-telegram-bot-api/src/telegram");
const { options } = require("nodemon/lib/config");
const { commandList } = require("./commands");

const BOT = new TELEGRAM_API(TOKEN, { polling: true });

BOT.setMyCommands([{ command: "", description: "" }]);

const commandHandler = () => {
  BOT.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    const sender = msg.from.username;

    for (let i = 0; i < commandList.length; i++) {
      if (
        text.toLocaleLowerCase() == `шоунен ${commandList[i].commandName}` &&
        msg.hasOwnProperty("reply_to_message") === true
      ) {
        await BOT.sendMessage(
          chatId,
          `@${sender} ${
            commandList[i].phrases[
              Math.floor(Math.random() * commandList[i].phrases.length)
            ]
          } @${msg.reply_to_message.from.username}`
        );
      }
    }
  });
};

commandHandler();
