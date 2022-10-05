require("dotenv").config();
const TELEGRAM_API = require("node-telegram-bot-api");
const { messageTypes } = require("node-telegram-bot-api/src/telegram");
const fs = require("fs");
const { options } = require("nodemon/lib/config");
const { RolePlayCommandList } = require("./commands");
const { resourceLimits } = require("worker_threads");
const { send } = require("process");

const BOT = new TELEGRAM_API(process.env.TOKEN, { polling: true });

BOT.setMyCommands([
  {
    command: "/help",
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
      'Вас приветствует ультрамегасупер хорошая служба поддержки "ШОУНЕН" ver. a0.4 от Шоунен-бота\n\nДля использования любой из нижеперечисленных команд вам необходимо ответить на сообщение пользователя, который будет получателем, и использовать следующую конструкцию: Шоунен "команда"\n\nСписок доступных команд:\n\n🤗🤗 || обнять\n\n💋💋 || поцеловать\n\n💗💗 || признаться в любви\n\n👍👍 || похвалить\n\n😻😻 || погладить\n\n🥵🥵 || надругаться\n\n🍛🍛 || покормить\n\n😳😳 || я вахуи\n\n😼😼 || укусить\n\n👅👅 || лизнуть\n\n💅💅 || оценить ноготочки\n\n🐺🐺 || ауф\n\n⚔️⚔️ || устроить крестовый поход\n\n🤼‍♂️🤼‍♂️ || бороться\n\n🔫🔫 || расстрелять'
    );
  });
})();

function createDuelistProfile(username, id, hp, weapon) {
  this.username = username;
  this.id = id;
  this.hp = hp;
  this.weapon = weapon;
}

const hitDetector = () => {
  const hit = Math.floor(Math.random() * 2);
  let hitResult = null;

  if (hit == 1) {
    hitResult = "попал";
  } else {
    hitResult = "промазал";
  }

  return hitResult;
};

const duelsOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        {
          text: "Согласиться на дуэль",
          callback_data: "Yes",
        },
        {
          text: "Отказаться от дуэли",
          callback_data: "No",
        },
      ],
    ],
  }),
};

const DuelHandler = (
  recipientId,
  recipientUsername,
  senderId,
  senderUsername
) => {

  const DuelLaunch = async (chatId) => {
    const weaponsList = [
      pistol = {
        name: "pistol"
      },
      gun = {
        name: "gun"
      }
    ]

    const sender = new createDuelistProfile(senderUsername, senderId, 100, weaponsList[Math.floor(Math.random()*weaponsList.length)])
    const recipient = new createDuelistProfile(recipientUsername, recipientId, 100, weaponsList[Math.floor(Math.random()*weaponsList.length)])

    await BOT.sendMessage(
      chatId,
      `@${recipient.username} наклоняется и поднимает дедовскую перчатку. Дуэль между @${sender.username} и @${recipient.username} начинается!\n\nОба пользователя наугад берут коробку с оружием и расходятся в разные стороны. Каждый вытаскивает свое оружие: у @${sender.username} ${sender.weapon.name}; у @${recipient.username} ${recipient.weapon.name}`
    );
  };

  BOT.on("callback_query", async (query) => {
    const { chat, message_id } = query.message;

    switch (true) {
      case query.data === "Yes" && recipientId == query.from.id:
          DuelLaunch(chat.id);
        break;
      case query.data === "No" && recipientId == query.from.id:
        await BOT.editMessageText(
          `Дуэль отменена. @${recipientUsername} отказался от участия в этом кровопролитном деянии`,
          {
            chat_id: chat.id,
            message_id: message_id,
          }
        );
        break;
    }
  });
};

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
        msg.hasOwnProperty("reply_to_message") === true &&
        text.toLowerCase() != `шоунен дуэль`
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
      } else if (
        msg.hasOwnProperty("reply_to_message") === true &&
        text.toLowerCase() === `шоунен дуэль`
      ) {
        await BOT.sendMessage(
          chatId,
          `@${sender} снял дедовскую перчатку со своей правой руки и швырнул прямо вам в лицо, объявив дуэль, @${msg.reply_to_message.from.username}\n\nЧтобы согласиться, или отказаться, нажмите соответствующую кнопку`,
          duelsOptions
        );
        DuelHandler(
          msg.reply_to_message.from.id,
          msg.reply_to_message.from.username,
          msg.from.id,
          msg.from.username
        );
        break;
      }
    }
  });
})();
