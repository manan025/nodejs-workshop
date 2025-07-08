const express = require('express')
const dotenv = require('dotenv').config()
const {createClient} = require("./lib/supabase")

const auth = require("./routes/auth")
const realtime = require("./routes/realtime")
const database = require("./routes/database")

const app = express()

// Add JSON body parsing middleware
app.use(express.json())

app.use('/auth', auth)
app.use('/realtime', realtime)
app.use('/database', database)


app.get('/', (req, res) => {
    res.send('index')
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})
