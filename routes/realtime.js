// TODO: IN PROGRESS. NOT REVIEWED.

const express = require('express')
const { checkSession } = require('../lib/supabase')

const router = express.Router()


router.post('/send', async (req, res) => {

    const { isSignedIn, user, error } = await checkSession(req, res)

    if (!isSignedIn) {
        return res.status(401).json({
            error: 'User not authenticated',
            message: 'Please sign in to send messages'
        })
    }

    console.log('User is authenticated:', user.email)

    res.json({
        success: true,
        message: req.body.message,
        user: user.email
    })
})


module.exports = router
