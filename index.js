const TOKEN = "5625717603:AAEM-f_lKhTX_CbiU-gwTT_4Dhpxd5DFumQ";
const TELEGRAM_API = require("node-telegram-bot-api");
const { messageTypes } = require("node-telegram-bot-api/src/telegram");
const { options } = require("nodemon/lib/config");

const BOT = new TELEGRAM_API(TOKEN, { polling: true });

BOT.setMyCommands([{ command: "", description: "" }]);

const hugs = () => {
  BOT.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    const sender = msg.from.username;

    const phrasesArr = [
      "крепко прижал(а) к себе",
      "задушил(а), но не ляшками,",
      "с любовью обнял(а)",
      "до смерти заобнимал(а)",
    ];

    if (
      text == "шоунен обнять" &&
      msg.hasOwnProperty("reply_to_message") === true
    ) {
      await BOT.sendMessage(
        chatId,
        `@${sender} ${
          phrasesArr[Math.floor(Math.random() * phrasesArr.length)]
        } @${msg.reply_to_message.from.username}`
      );
    }
  });
};

hugs();
