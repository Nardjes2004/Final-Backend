import { Router } from 'express'
import { ordersCollections, usersCollection } from '../models/index.js'
import mongoose from 'mongoose';
import { NoOrdersException, NoUserFound } from '../utilities/errors.js';
import authMiddleware from '../middlewares/auth.js';
const ObjectId = mongoose.Types.ObjectId;

export default () => {
    let router = Router()

    //Creating a new user
    //We are going to receive data about user (In the body of the request)
    // /api/users

    //  /api/users
    router.post('/', authMiddleware,async (req, res) => {
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

    router.post("/add_by_fullname", async (req, res) => {
        try {
            const { username, email, age, fullName, address } = req.body;

            // Create a new user and set `fullName` using the virtual setter
            const newUser = await usersCollection.create({ username, email, age, address });
            newUser.fullName = fullName; // This sets both `firstName` and `lastName`

            await newUser.save();
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

       
    // GET /users/:id
    router.get("/:id", async (req, res) => {
        try {
            const user = await usersCollection.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            console.log(user.totalStorageUser) // 5800 + 6600
            // Use the virtual getter to get `fullName`
            const userData = {
                ...user,
                fullName: user.fullName, // This uses the virtual getter,
                totalStorageUser: user.totalStorageUser,
                profileUrl: user.profileUrl // '/users/${user.username}
            };

            res.json(userData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    //Update a user
    router.put('/:id', async (req, res) => {
        const { id } = req.params
        const body = req.body
        // const {username, age, email} = req.body

        // (filter, data)
        const newUpdate = await usersCollection.findOneAndUpdate({ _id: id }, { username: body.username, email: body.email, age: body.age }, { returnDocument: 'after' })
        if (newUpdate) {
            res.send({ success: true, user: newUpdate })
        } else {
            res.send({ success: false, message: 'Server Error' })
        }
    })

    router.put('/update_many/:username', async (req, res) => {
        const body = req.body
        const { username } = req.params
        const newUpdate = await usersCollection.updateMany({ username: { $regex: username } }, body)
        if (newUpdate) {
            res.send({ success: true, user: newUpdate })
        } else {
            res.send({ success: false, message: 'Server Error' })
        }
    })

    router.get('/:id/orders', async (req, res) => {
        try {
            const { id } = req.params
            const user = await usersCollection.findById(id)
            if(!user) throw NoUserFound
            const orders = await ordersCollections.find({ user: id }).populate("products.product_id")

            if (orders.length > 0) {
                res.send({ success: true, response: orders });
                res.send()
            } else {
                // res.send({ success: false, message: "No orders found for this user" });
                throw NoOrdersException
            }
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    })


    return router

}
