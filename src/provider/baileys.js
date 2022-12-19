const pino = require('pino')
const mime = require('mime-types')
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@adiwajshing/baileys')

class Baileys {

    error_remoteJid = {
        status: "error",
        message: "Invalid remoteJid",
        valid: {
            privateChat: "xxxxxxxxxxx@c.us",
            groupChat: "xxxxxxxxxxxxxxxxxx@g.us"
        }
    }

    error_remoteJid_url = {

    }

    constructor() {

        this.client;

    }

    async init() {

        const { state, saveCreds } = await useMultiFileAuthState('whatsapp-session')


        this.client = makeWASocket({
            printQRInTerminal: true,
            auth: state,
            logger: pino({ level: 'error' })

        })

        this.client.ev.on("creds.update", saveCreds)

        this.client.ev.on("connection.update", (update) => {

            const { connection, lastDisconnect } = update

            const statusCode = lastDisconnect?.error?.output?.statusCode

            if (statusCode && (statusCode !== DisconnectReason.loggedOut)) this.init()

            if (connection === "open") console.log("Connected to WhatsApp");


        })

    }

    /**
     * @param {string} remoteJid 
     * @param {string} message 
     * @param {any} messages - optional
     * @example await sendMessage("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "Hello World", messages)
     */
    async sendMessage(remoteJid, message, messages = null) {

        await this.client.sendMessage(remoteJid, { text: message }, { quoted: messages })

        return { status: "success" }
    }

    async onMessage(m) {



        this.client.ev.on("messages.upsert", ({ messages }) => m(messages[0]))



    }

    /**
     * @param {string} remoteJid 
     * @param {string} url
     * @param {any} messages - optional
     * @example await await sendImage("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "https://domain.com/image.jpg", messages)
     */

    async sendImage(remoteJid, url, messages = null) {

        await this.client.sendMessage(remoteJid, { image: { url: url } }, { quoted: messages })

        return { status: "success" }



    }

    /**
    * @param {string} remoteJid 
    * @param {string} url
    * @param {boolean} voiceNote - optional
    * @param {any} messages - optional
    * @example await sendAudio("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "https://domain/audio.mp3", true, messages)
    */

    async sendAudio(remoteJid, url, voiceNote = false, messages = null) {

        await this.client.sendMessage(remoteJid, { audio: { url: url }, ptt: voiceNote }, { quoted: messages })
        return { status: "success" }
    }

    /**
     * @param {string} remoteJid 
     * @param {string} filePath 
     * @param {any} messages - optional
     * @example await sendFile("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "https://domain/file.pdf", messages)
     */
    async sendFile(remoteJid, url, messages = null) {

        const fileName = url.split("/").pop()
        const extension = fileName.split(".").pop()
        const mimetype = mime.lookup(extension) || "application/octet-stream"

        await this.client.sendMessage(remoteJid, {
            document: { url: url },
            fileName: fileName,
            mimetype: mimetype
        }, { quoted: messages })

        return { status: "success" }


    }

    /**
     * @param {string} remoteJid
     * @param {string} text
     * @param {string} footer
     * @param {Array} buttons
     * @param {any} messages - optional
     * @example await sendButtons("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "Your Text", "Your Footer", [{"buttonId": "id", "buttonText": {"displayText": "Button"}, "type": 1}], messages)
     */

    async sendButtons(remoteJid, text, footer, buttons, messages = null) {

        const buttonMessage = {

            text: text,
            footer: footer,
            buttons: buttons,
            headerType: 1,
        }

        await this.client.sendMessage(remoteJid, buttonMessage, { quoted: messages })

        return { status: "success" }
    }

    /**
     * @param {string} remoteJid 
     * @example await getProfilePictureUrl("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us")
     */

    async getProfilePictureUrl(remoteJid) {

        const profile = await this.client.profilePictureUrl(remoteJid)

        return {
            status: "success",
            profile: profile
        }
    }

    /**
     * @param {string} remoteJid 
     * @param {string} contactNumber 
     * @param {string} displayName 
     * @param {any} messages - optional 
     */
    async sendContact(remoteJid, contactNumber, displayName, messages = null) {

        const cleanContactNumber = contactNumber.replaceAll(" ", "")
        const waid = cleanContactNumber.replace("+", "")

        const vcard =
            'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + `FN:${displayName}\n`
            + 'ORG:Ashoka Uni;\n'
            + `TEL;type=CELL;type=VOICE;waid=${waid}:${cleanContactNumber}\n`
            + 'END:VCARD'

        await this.client.sendMessage(remoteJid, {
            contacts: {

                displayName: 'XD',
                contacts: [{ vcard }]
            }
        }, { quoted: messages })

        return { status: "success" }
    }

    /**
     * @param {string} remoteJid 
     * @param {string} latitude 
     * @param {string} longitude 
     * @param {any} messages 
     * @example await sendLocation("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "xx.xxxx", "xx.xxxx", messages)
     */

    async sendLocation(remoteJid, latitude, longitude, messages = null) {

        await this.client.sendMessage(remoteJid, {
            location: { degreesLatitude: latitude, degreesLongitude: longitude }
        }, { quoted: messages })

        return { status: "success" }
    }

    /**
     * @type WAPresence = 'unavailable' | 'available' | 'composing' | 'recording' | 'paused'
     * @param {string} id 
     * @param {*} presence 
     */
    async sendPresenceUpdate(id, WAPresence) {

        await this.client.sendPresenceUpdate(WAPresence, id)


    }

}


module.exports = Baileys