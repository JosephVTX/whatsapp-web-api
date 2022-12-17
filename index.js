require('dotenv').config();

const PORT = process.env.PORT || 3000;
const {app, whatsapp} = require('./src/api/server');

app.listen(PORT, async() => {

    console.log(`Server listening on port ${PORT}`)
    await whatsapp.init()
})