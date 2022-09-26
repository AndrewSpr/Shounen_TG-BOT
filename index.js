require("dotenv").config();
const TELEGRAM_API = require("node-telegram-bot-api");
const { messageTypes } = require("node-telegram-bot-api/src/telegram");
const fs = require("fs");
const { options } = require("nodemon/lib/config");
const { RolePlayCommandList } = require("./commands");

const BOT = new TELEGRAM_API(process.env.TOKEN, { polling: true });

BOT.setMyCommands([
  {
    command: ":help",
    description:
      "Выводит список доступных комманд в среде Шоунена, включая примеры использования",
  },
]);

const helpScreener = (() => {
  //an arrow function that will display help information on the screen
  BOT.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    BOT.sendMessage(
      chatId,
      'Вас приветствует ультрамегасупер хорошая служба поддержки "ШОУНЕН" ver. a0.4 от Шоунен-бота\n\nДля использования любой из нижеперечисленных команд вам необходимо ответить на сообщение пользователя, который будет получателем, и использовать следующую конструкцию: Шоунен "команда"\n\nСписок доступных команд:\n\n🤗🤗 || обнять\n\n💋💋 || поцеловать\n\n💗💗 || признаться в любви\n\n👍👍 || похвалить\n\n🥵🥵 || надругаться\n\n😼😼 || укусить\n\n👅👅 || лизнуть\n\n🐺🐺 || ауф\n\n⚔️⚔️ || устроить крестовый поход\n\n🤼‍♂️🤼‍♂️ || бороться'
    );
  });
})();

const commandHandler = (() => {
  // an arrow function that will process simple commands and send a response to them
  BOT.on("message", async (msg) => {
    const text = msg.text || ""; // var stores data about text of the message that the user sent; is initialized with an empty string
    const chatId = msg.chat.id; // var stores chat ID

    const sender = msg.from.username; // var stores the data about the sender's ID

    /* task of the loop is to look through all 
    array indexes from the commands module
    and find the properties of the command 
    that corresponds to the one requested by the user */

    for (let i = 0; i < RolePlayCommandList.length; i++) {
      if (
        text.toLowerCase() == `шоунен ${RolePlayCommandList[i].commandName}` &&
        msg.hasOwnProperty("reply_to_message") === true
      ) {
        const randomPhoto = Math.floor(
          Math.random() * RolePlayCommandList[i].photo.length
        ); // var stores the result of calculating the index of the photo that will be sent
        const randomPhrase = Math.floor(
          Math.random() * RolePlayCommandList[i].phrases.length
        ); // var stores the result of calculating the index of the phrase that will be set as a description for the photo
        await BOT.sendPhoto(
          chatId,
          fs.readFileSync(
            __dirname + RolePlayCommandList[i].photo[randomPhoto]
          ),
          {
            caption: `@${sender} ${RolePlayCommandList[i].phrases[randomPhrase]} @${msg.reply_to_message.from.username}`,
          }
        );
      }
    }
  });
})();
