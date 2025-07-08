const express = require('express')
const {createClient} = require("../lib/supabase");

const router = express.Router()

router.get('/', (req, res) => {
    res.send('auth')
})

// ### REGISTER ###

async function signUpNewUser(email, password, req, res) {
    const {data, error} = await createClient({req, res}).auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: 'https://localhost:3000/welcome',
        },
    })
    console.log(email, password, data, error)
    return {data, error}
}

router.get('/register', (req, res) => {
    const email = req.query.email
    const password = req.query.password
    signUpNewUser(email, password, req, res).then(r => res.json({r}))
})


// ### LOGIN ###
async function signInWithEmail(email, password, context) {
    const {data, error} = await createClient(context).auth.signInWithPassword({
        email: email,
        password: password,
    })
    return {data, error}
}

router.get('/login', (req, res) => {
    const email = req.query.email
    const password = req.query.password
    signInWithEmail(email, password, {req, res}).then(r =>
        res.json({r})
    )
})

module.exports = router

