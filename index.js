const express = require('express')
const dotenv = require('dotenv').config()
const {createClient} = require("./lib/supabase")
const auth = require("./routes/auth")

const app = express()
app.use('/auth', auth)


app.get('/', (req, res) => {
    res.send('index')
})

app.get('/welcome', (req, res) => {
    // check if signed in and then accessible
    
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})
