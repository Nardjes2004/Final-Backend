import { Router } from 'express'
import { usersCollection } from '../models/index.js'
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export default () => {
    let router = Router()

    //Creating a new user
    //We are going to receive data about user (In the body of the request)
    // /api/users

    //  /api/users
    router.post('/', async (req, res) => {
        const body = req.body
        console.log(body)
        // !body.username || !body.age || !body.email
        if (body.username && body.age && body.email) {
            const user = await usersCollection.create(body)
            if (user) {
                res.send({ success: true, message: "User created successfully", user: user })
            } else {
                res.send({ success: false, message: "Try again" })
            }
        } else {
            res.send({ success: false, message: 'Please send user information' })
        }
    })


    //Update a user
    router.put('/', async (req, res) => {
        const body = req.body
        // const {username, age, email} = req.body

        // (filter, data)
        console.log(body)
        const result = await usersCollection.updateMany(
            { _id: new ObjectId('672bc6cc1d60f8c878ef48e0') },
            { $set: { username: body.username, age: body.age } }
        )
        res.send({ success: true, result })

    })

    router.put('/update_many', async (req, res) => {
        const body = req.body
        const newUpdate = await usersCollection.updateMany({ username: { $regex: body.username } }, { age: body.age })
        if (newUpdate) {
            res.send({ success: true, user: newUpdate })
        } else {
            res.send({ success: false, message: 'Server Error' })
        }
    })


    return router

}
