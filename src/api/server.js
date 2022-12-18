const Baileys = require("../provider/baileys")
const express = require("express")


const app = express()

app.use(express.json())

const whatsapp = new Baileys()

app.post("/api/text", async (req, res) => {


    const { remoteJid, message } = req.body

    if (remoteJid && message) {

        whatsapp.sendMessage(remoteJid, message)
            .then(r => res.status(200).send(r))
            .catch(e => res.status(400).send(e))

    }

    else {

        res.status(400).send("Bad request")
    }



})

app.post("/api/audio", async (req, res) => {

    const { remoteJid, url, voiceNote } = req.body

    if (remoteJid && url) {


        whatsapp.sendAudio(remoteJid, url, voiceNote)
            .then(r => res.status(200).send(r))
            .catch(e => res.status(400).send(e))
    }

    else {

        res.status(400).send("Bad request")
    }

})

app.post("/api/image", async (req, res) => {

    const { remoteJid, url } = req.body

    if (remoteJid, url) {

        whatsapp.sendImage(remoteJid, url)
            .then(r => res.status(200).send(r))
            .catch(e => res.status(400).send(e))
    }

    else {

        res.status(400).send("Bad request")
    }


})

app.post("/api/file", async (req, res) => {

    const { remoteJid, url, fileName } = req.body

    if (remoteJid && url) {

        whatsapp.sendFile(remoteJid, url, fileName)
            .then(r => res.status(200).send(r))
            .catch(e => res.status(400).send(e))
    }

    else {

        res.status(400).send("Bad request")
    }
})

app.get("/api/profile/:remoteJid", async (req, res) => {

    const { remoteJid } = req.params

    if (remoteJid) {

        whatsapp.getProfilePictureUrl(remoteJid)
            .then(r => res.status(200).send(r))
            .catch(e => res.status(400).send(e))
    }

    else {

        res.status(400).send("Bad request")
    }
})

app.post("/api/contact", async (req, res) => {

    const { remoteJid, contactNumber, displayName } = req.body

    if (remoteJid && contactNumber && displayName) {

        whatsapp.sendContact(remoteJid, contactNumber, displayName)
            .then(r => res.status(200).send(r))
            .catch(e => res.status(400).send(e))
    }

    else {

        res.status(400).send("Bad request")
    }
})


app.post("/api/location", async (req, res) => {


    const { remoteJid, latitude, longitude } = req.body

    if (remoteJid && latitude && longitude) {

        whatsapp.sendLocation(remoteJid, latitude, longitude)
            .then(r => res.status(200).send(r))
            .catch(e => res.status(400).send(e))
    }
   
    else{
            
            res.status(400).send("Bad request")
    }
})


module.exports = { app, whatsapp }