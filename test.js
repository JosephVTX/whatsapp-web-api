const Baileys = require("./src/provider/baileys");

const whatsapp = new Baileys()


const text = async () => {


    await whatsapp.init()

    whatsapp.onMessage(

        async (messages) => {

            const messageBody = messages.message?.conversation
            const remoteJid = messages.key?.remoteJid
            const fromMe = messages.key?.fromMe

            if (!fromMe && messageBody) {


                await whatsapp.sendSticker(remoteJid, "https://media2.giphy.com/media/8m4R4pvViWtRzbloJ1/giphy.gif")
                

            }
        })
}

text()