import { Router } from 'express'
import { usersCollection } from '../models/index.js'

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
    router.put('/:id', (req, res) => {
        const { id } = req.params
        console.log(id)
        //Let's look for the user with id
        //If it exists we update it

        res.send({
            success: true,
            message: `User with id = ${id} has been updated`
        })
    })


    return router

}
