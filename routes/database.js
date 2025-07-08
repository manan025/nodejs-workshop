const express = require('express')
const { createClient, checkSession } = require('../lib/supabase')

const router = express.Router()

router.post('/create', async (req, res) => {
    try {
        const { isSignedIn, user, error: authError } = await checkSession({req, res})

        if (!isSignedIn) {
            return res.status(401).json({
                error: 'User not authenticated',
                message: 'Please sign in to create records'
            })
        }

        const { name, place } = req.body

        if (!name || !place) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Name and place are required'
            })
        }

        const supabase = createClient({req, res})

        const { data, error } = await supabase
            .from('profile')
            .insert([
                {
                    name: name,
                    place: place,
                    user_id: user.id
                }
            ])
            .select()

        if (error) {
            console.error('Database error:', error)
            return res.status(500).json({
                error: 'Database error',
                message: error.message
            })
        }

        res.status(201).json({
            success: true,
            message: 'Record created successfully',
            data: data[0]
        })

    } catch (error) {
        console.error('Server error:', error)
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        })
    }
})

router.put('/update/:id', async (req, res) => {
    try {
        const { isSignedIn, user, error: authError } = await checkSession({req, res})

        if (!isSignedIn) {
            return res.status(401).json({
                error: 'User not authenticated',
                message: 'Please sign in to update records'
            })
        }

        const { id } = req.params
        const { name, place } = req.body

        if (!name || !place) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Name and place are required'
            })
        }

        const supabase = createClient({req, res})

        const { data, error } = await supabase
            .from('records')
            .update({
                name: name,
                place: place
            })
            .eq('id', user.id)
            .select()

        if (error) {
            console.error('Database error:', error)
            return res.status(500).json({
                error: 'Database error',
                message: error.message
            })
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                error: 'Record not found',
                message: 'Record not found or you do not have permission to update it'
            })
        }

        res.json({
            success: true,
            message: 'Record updated successfully',
            data: data[0]
        })

    } catch (error) {
        console.error('Server error:', error)
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        })
    }
})

router.get('/fetch', async (req, res) => {
    try {

        const { isSignedIn, user, error: authError } = await checkSession({req, res})

        if (!isSignedIn) {
            return res.status(401).json({
                error: 'User not authenticated',
                message: 'Please sign in to fetch records'
            })
        }

        const supabase = createClient({req, res})

        const { data, error } = await supabase
            .from('records')
            .select('*')
            .eq('id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Database error:', error)
            return res.status(500).json({
                error: 'Database error',
                message: error.message
            })
        }

        res.json({
            success: true,
            message: 'Records fetched successfully',
            data: data,
            count: data.length
        })

    } catch (error) {
        console.error('Server error:', error)
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        })
    }
})

router.get('/fetch/:id', async (req, res) => {
    try {
        const { isSignedIn, user, error: authError } = await checkSession({req, res})

        if (!isSignedIn) {
            return res.status(401).json({
                error: 'User not authenticated',
                message: 'Please sign in to fetch records'
            })
        }

        const { id } = req.params
        const supabase = createClient({req, res})


        const { data, error } = await supabase
            .from('records')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    error: 'Record not found',
                    message: 'Record not found or you do not have permission to access it'
                })
            }

            console.error('Database error:', error)
            return res.status(500).json({
                error: 'Database error',
                message: error.message
            })
        }

        res.json({
            success: true,
            message: 'Record fetched successfully',
            data: data
        })

    } catch (error) {
        console.error('Server error:', error)
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        })
    }
})

module.exports = router
