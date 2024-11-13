import { Router } from "express";
import { usersCollection } from "../models/index.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import CONFIG from '../config.json' with {type: "json"}

export default () => {
    let router = Router()

    router.post('/register', async (req, res) => {
        const { username, email, password } = req.body;

        try {
            // Check if user already exists
            let user = await usersCollection.findOne({ email });
            if (user) return res.status(400).json({ msg: 'User already exists' });

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user
            user = new usersCollection({ username, email, password: hashedPassword });
            await user.save();

            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, CONFIG.jwt_secret, { expiresIn: '1h' });

            res.status(201).json({ token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // Login user
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            // Check if user exists
            const user = await usersCollection.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, CONFIG.jwt_secret, { expiresIn: '1h' });

            res.json({ token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router
}