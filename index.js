require("dotenv").config();
const TELEGRAM_API = require("node-telegram-bot-api");
const { messageTypes } = require("node-telegram-bot-api/src/telegram");
const fs = require("fs");
const { options } = require("nodemon/lib/config");
const { RolePlayCommandList } = require("./commands");
const { resourceLimits } = require("worker_threads");

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

function createDuelistProfile(username, id, hp, weapon) {
  this.username = username
  this.id = id;
  this.hp = hp;
  this.weapon = weapon;
}

const hitDetector = () => {
  const hit = Math.floor(Math.random()*2);
  let hitResult = null;

  if(hit == 1) {
    hitResult = 'попал'
  } else {
    hitResult = 'промазал'
  }
  
  return hitResult;
}

const duelsOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        {
          text: "Согласиться на дуэль",
          callback_data: "Yes"
        },
        {
          text: "Отказаться от дуэли",
          callback_data: "No"
        }
      ]
    ]
  })
}


const DuelHandler = (chatId) => {

  /*BOT.on("message", async (msg) => {
    const text = msg.text || "";
    const chatId = msg.chat.id;

    const weaponsList = [
      pistol = {
        name: 'Pistol',
        damage: 15
      },
      machineGun = {
        name: 'Machinegun',
        damage: 25
      }
    ]

    if(text.toLowerCase() == 'шоунен дуэль' && msg.hasOwnProperty("reply_to_message") === true) {
      const sender = new createDuelistProfile(msg.from.username, msg.from.id, 100, weaponsList[Math.floor(Math.random()*weaponsList.length)])
      const recipient = new createDuelistProfile(msg.reply_to_message.from.username, msg.reply_to_message.from.id, 100, weaponsList[Math.floor(Math.random()*weaponsList.length)])
      let senderHp = sender.hp, recipientHp = recipient.hp;
      
      for(let move = 0; senderHp > 0 || recipientHp > 0; move++) {
        let senderHit = hitDetector(), recipientHit = hitDetector();
        BOT.sendMessage(chatId, `@${sender.username} сделал выстрел из ${sender.weapon.name} и он ${senderHit} \n@${recipient.username} сделал выстрел из ${recipient.weapon.name} и он ${recipientHit}`);

        if(senderHit == 'попал') {
          recipientHp -= sender.weapon.damage
        } else if (recipientHit == 'попал') {
          senderHp -= recipient.weapon.damage
        } else if (recipientHp <= 0) {
          BOT.sendMessage(chatId, `@${recipient.username} проиграл в дуэли`)
        } else if (senderHp <= 0) {
          BOT.sendMessage(chatId, `@${sender.username} проиграл дуэль`)
        }
      }

    }
  })*/
}

const DuelingResponseHandler = (recipientId, recipientUsername) => {
  BOT.on("callback_query", async (query) => {
    const {chat, message_id} = query.message
  
    switch (true) {
      case query.data === "Yes" && recipientId == query.from.id:
        console.log(query)
      break;
      case query.data === "No" && recipientId == query.from.id:
        BOT.editMessageText(`Дуэль отменена. @${recipientUsername} отказался от участия в этом кровопролитном деянии`, {
          chat_id: chat.id,
          message_id: message_id
        })
      break;
    }
  })
}

const DuelDeclaration = (() => {
  BOT.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";

    const sender = msg.from.username

    if (text.toLowerCase() == 'шоунен дуэль' && msg.hasOwnProperty("reply_to_message") === true) {
      await BOT.sendMessage(chatId, `@${sender} снял дедовскую перчатку со своей правой руки и швырнул прямо вам в лицо, объявив дуэль, @${msg.reply_to_message.from.username}\n\nЧтобы согласиться, или отказаться, нажмите соответствующую кнопку`, duelsOptions)
      DuelingResponseHandler(msg.reply_to_message.from.id, msg.reply_to_message.from.username);
    }
  })
})();