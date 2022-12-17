const pino = require('pino')
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@adiwajshing/baileys')

class Baileys {


    constructor() {

        this.client;
    }

    async init() {

        const { state, saveCreds } = await useMultiFileAuthState('whatsapp-session')

        this.client = await makeWASocket({
            printQRInTerminal: true,
            auth: state,
            logger: pino({ level: 'error' }),
            downloadHistory: false

        })


        this.client.ev.on("connection.update", async (update) => {

            const { connection, lastDisconnect } = update
            const statusCode = lastDisconnect?.error?.output?.statusCode

            if (connection === "open") console.log("Connected to WhatsApp");

            if (statusCode && (statusCode !== DisconnectReason.loggedOut)) {
                await saveCreds()
                this.init()
            }
        })
    }

    /**
     * @param {string} remoteJid 
     * @param {string} message 
     * @example await sendMessage("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "Hello World")
     */
    async sendMessage(remoteJid, message) {

        if (!remoteJid.includes("@")) return

        try { await this.client.sendMessage(remoteJid, { text: message }) }
        catch { return }
    }

    /**
     * @param {string} remoteJid 
     * @param {string} url 
     * @example await await sendImage("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "https://domain.com/image.jpg")
     */

    async sendImage(remoteJid, url) {


        if (!remoteJid.includes("@") || !url.includes("http")) return

        try { await this.client.sendMessage(remoteJid, { image: { url: url } }) }

        catch { return }
    }

    /**
    * @param {string} remoteJid 
    * @param {string} url
    * @param {boolean} voiceNote - optional
    * @example await sendAudio("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "https://domain/audio.mp3", true)
    */

    async sendAudio(remoteJid, url, voiceNote = false) {

        if (!remoteJid.includes("@") || !url.includes("http")) return

        try { await this.client.sendMessage(remoteJid, { audio: { url: url }, ptt: voiceNote }) }

        catch { return }
    }

    /**
     * @param {string} remoteJid 
     * @param {string} filePath 
     * @example await sendFile("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "https://domain/file.pdf")
     */
    async sendFile(remoteJid, url, fileName) {

        if (!remoteJid.includes("@") || !url.includes("http")) return

        try {
            const fileName_ = fileName || url.split("/").pop()
            await this.client.sendMessage(remoteJid, {
                document: { url: url },
                fileName: fileName_

            })
        }
        catch { return }

    }

    /**
     *
     * @param {string} remoteJid
     * @param {string} text
     * @param {string} footer
     * @param {Array} buttons
     * @example await sendButtons("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "Your Text", "Your Footer", [{"buttonId": "id", "buttonText": {"displayText": "Button"}, "type": 1}])
     */

    async sendButtons(remoteJid, text, footer, buttons) {

        if (!remoteJid.includes("@")) return

        const buttonMessage = {

            text: text,
            footer: footer,
            buttons: buttons,
            headerType: 1,
        }

        try {
            await this.client.sendMessage(remoteJid, buttonMessage)
        }

        catch { return }
    }

}


module.exports = Baileys