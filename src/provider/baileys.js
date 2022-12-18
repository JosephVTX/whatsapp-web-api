const pino = require('pino')
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

        this.client = await makeWASocket({
            printQRInTerminal: true,
            auth: state,
            logger: pino({ level: 'error' })

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

        if (!remoteJid.includes("@")) throw this.error_remoteJid

        await this.client.sendMessage(remoteJid, { text: message })

        return { status: "success" }
    }

    /**
     * @param {string} remoteJid 
     * @param {string} url 
     * @example await await sendImage("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "https://domain.com/image.jpg")
     */

    async sendImage(remoteJid, url) {


        if (!remoteJid.includes("@")) throw this.error_remoteJid

        if(!url.includes("http")) throw "Invalid url"

        await this.client.sendMessage(remoteJid, { image: { url: url } })

        return { status: "success" }



    }

    /**
    * @param {string} remoteJid 
    * @param {string} url
    * @param {boolean} voiceNote - optional
    * @example await sendAudio("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "https://domain/audio.mp3", true)
    */

    async sendAudio(remoteJid, url, voiceNote) {

        if (!remoteJid.includes("@")) throw this.error_remoteJid

        if(!url.includes("http")) throw "Invalid url"

        await this.client.sendMessage(remoteJid, { audio: { url: url }, ptt: voiceNote || false })
        return { status: "success" }
    }

    /**
     * @param {string} remoteJid 
     * @param {string} filePath 
     * @example await sendFile("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us", "https://domain/file.pdf")
     */
    async sendFile(remoteJid, url, fileName) {

        if (!remoteJid.includes("@")) throw this.error_remoteJid

        if(!url.includes("http")) throw "Invalid url"


        const fileName_ = fileName || url.split("/").pop()

        await this.client.sendMessage(remoteJid, {
            document: { url: url },
            fileName: fileName_
        })

        return { status: "success" }


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

        if (!remoteJid.includes("@")) throw this.error_remoteJid

        const buttonMessage = {

            text: text,
            footer: footer,
            buttons: buttons,
            headerType: 1,
        }

        await this.client.sendMessage(remoteJid, buttonMessage)

        return { status: "success" }
    }

    /**
     * @param {string} remoteJid 
     * @example await getProfilePictureUrl("xxxxxxxxxxx@c.us" || "xxxxxxxxxxxxxxxxxx@g.us")
     */

    async getProfilePictureUrl(remoteJid) {

        if (!remoteJid.includes("@")) throw this.error_remoteJid

        const profile = await this.client.profilePictureUrl(remoteJid)

        return {
            status: "success",
            profile: profile
        }
    }


    async sendContact(remoteJid, contactNumber, displayName) {


        if (!remoteJid.includes("@")) throw this.error_remoteJid

        if(!contactNumber.includes("+")) throw "Invalid contact number (must include country code)"

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
                contacts: [{vcard}]
            }
        })

        return { status: "success" }
    }


    async sendLocation(remoteJid, latitude, longitude) {


        if (!remoteJid.includes("@")) throw this.error_remoteJid
        
        await this.client.sendMessage(remoteJid, {
            location: { degreesLatitude: latitude, degreesLongitude: longitude }
        })

        return { status: "success" }
    }

}


module.exports = Baileys