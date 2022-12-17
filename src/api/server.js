const Baileys = require("../provider/baileys")
const express = require("express")


const app = express()

app.use(express.json())

const whatsapp = new Baileys()

app.post("/api/text", async (req, res) => {


    const { remoteJid, message } = req.body

    try {

        await whatsapp.sendMessage(remoteJid, message)
        res.status(200).send("Message sent")
    }
    catch (err) {

        res.status(500).send(err.message)
    }



})

app.post("/api/audio", async (req, res) => {

    const { remoteJid, url, voiceNote } = req.body

    if (remoteJid, url) {


        try {

            await whatsapp.sendAudio(remoteJid, url, voiceNote)

            res.status(200).send("Audio sent")

        }
        catch (err) {

            res.status(500).send(err.message)

        }
    }

    else {

        res.status(400).send("Bad request")
    }

})

app.post("/api/image", async (req, res) => {

    const { remoteJid, url } = req.body

    if (remoteJid, url) {

        try {

            await whatsapp.sendImage(remoteJid, url)

            res.status(200).send("Image sent")

        }

        catch (err) {

            res.status(500).send(err.message)

        }
    }

    else {

        res.status(400).send("Bad request")
    }


})

app.post("/api/file", async (req, res) => {

    const { remoteJid, url, fileName } = req.body

    if (remoteJid && url) {

        try {

            await whatsapp.sendFile(remoteJid, url, fileName)

            res.status(200).send("File sent")

        }

        catch (err) {

            res.status(500).send(err.message)

        }
    }

    else {

        res.status(400).send("Bad request")
    }
})



module.exports = { app, whatsapp }