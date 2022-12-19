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


                await whatsapp.sendContact(remoteJid, "+51927834271", "Trux", messages)
                

            }
        })
}

text()