import { Router } from "express";
import { ordersCollections } from "../models/index.js";

export default () => {

    const router = Router()

    router.get('/', async (req, res) => {

        const options = {}
        if (req.query.skip) {// query has skip
            options.skip = req.query.skip
        }
        // continue with limit same as skip
        const result = await ordersCollections.find({}, 'username email', options)
    })

    return router
}