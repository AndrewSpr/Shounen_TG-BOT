const TOKEN = "5625717603:AAEM-f_lKhTX_CbiU-gwTT_4Dhpxd5DFumQ";
require("dotenv").config();
const TELEGRAM_API = require("node-telegram-bot-api");
const { messageTypes } = require("node-telegram-bot-api/src/telegram");
const fs = require("fs");
const { options } = require("nodemon/lib/config");
const { commandList } = require("./commands");

const BOT = new TELEGRAM_API(process.env.TOKEN, { polling: true });

BOT.setMyCommands([{ command: "", description: "" }]);

const commandHandler = (() => {
  // an arrow function that will process simple commands and send a response to them
  BOT.on("message", async (msg) => {
    const text = msg.text; // var stores data about text of the message that the user sent
    const chatId = msg.chat.id; // var stores chat ID

    const sender = msg.from.username; // var stores the data about the sender's ID

    /* task of the loop is to look through all 
    array indexes from the commands module
    and find the properties of the command 
    that corresponds to the one requested by the user */

    for (let i = 0; i < commandList.length; i++) {
      if (
        text == `шоунен ${commandList[i].commandName}` &&
        msg.hasOwnProperty("reply_to_message") === true
      ) {
        const randomPhoto = Math.floor(
          Math.random() * commandList[i].photo.length
        ); // var stores the result of calculating the index of the photo that will be sent
        const randomPhrase = Math.floor(
          Math.random() * commandList[i].phrases.length
        ); // var stores the result of calculating the index of the phrase that will be set as a description for the photo
        await BOT.sendPhoto(
          chatId,
          fs.readFileSync(__dirname + commandList[i].photo[randomPhoto]),
          {
            caption: `@${sender} ${commandList[i].phrases[randomPhrase]} @${msg.reply_to_message.from.username}`,
          }
        );
      }
    }
  });
})();
