const express = require("express")
const cors = require("cors")
require('dotenv').config()

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3000

app.get('/test', async (req, res) => {

    console.log("Received a request")

    res.json({message: "Hi from server"})
})



app.listen(PORT, () => {

    console.log(`Server listening on http://localhost:${PORT}`)
})