const TOKEN = '5625717603:AAEM-f_lKhTX_CbiU-gwTT_4Dhpxd5DFumQ'

const TELEGRAM_API = require('node-telegram-bot-api')
const { options } = require('nodemon/lib/config')

const BOT = new TELEGRAM_API(TOKEN, {polling: true})

BOT.setMyCommands( [
    {command: '/start', description: ''}
])

const start = () => {
    BOT.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        await BOT.sendMessage(chatId,  `)
    })   
}

start()
