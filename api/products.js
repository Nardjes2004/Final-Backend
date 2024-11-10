import { Router } from "express";
import { productsCollection } from "../models/index.js";

export default () => {

    let router = Router()

    // Search products by term
    router.get('/', (req, res) => {
        const { search_term, size } = req.query

        res.send({
            success: true,
            message: `products of ${search_term} size ${size}`
        })
    })

    router.post('/', async (req, res) => {
        const { name, category, price, stock } = req.body
        // !name || !category || !price || !stock
        if (name && category && price && stock) {
            const new_product = await productsCollection.create({ name, category, price, stock })
            if (new_product) {
                res.send({
                    success: true,
                    data: new_product
                })
            } else {
                res.send({
                    success: false,
                    message: "Internal Server Error"
                })
            }
        } else {
            res.send({
                success: false,
                message: "Please fill all the infos"
            })
        }
    })

    // Fetch all products that have price higher than :price parameter
    router.get("/filter_by_price/:price", async (req, res) => {
        const { price } = req.params

        // greater than or equal
        // $lte $eq
        const result = await productsCollection.find({ price: { $gt: price } }, 'name price', { skip: 1, limit: 1 })
        if (result) {
            res.send({ success: true, response: result })
        } else {
            res.send({ success: false, message: "Try again" })
        }
    })


    router.get("/filter_by_category/:category", async (req, res) => {
        const { category } = req.params

        const result = await productsCollection.find({ category: { $regex: category } })
        if (result) {
            res.send({ success: true, response: result })
        } else {
            res.send({ success: false, message: "Try again" })
        }
    })

    // Filter and fetch using skip and limit as optional parameters (query)
    // router.get("/filter", async (req, res) => {
    //     const options = {}

    //     if (req.query.skip) {
    //         options.skip = req.query.skip
    //     }
    //     if (req.query.limit) {
    //         options.limit = req.query.limit
    //     }
    //     const list = await productsCollection.find({}, null, options)

    //     if (list) {
    //         res.send({
    //             success: true,
    //             count: list.length,
    //             data: list
    //         })
    //     } else {
    //         res.send({
    //             success: false,
    //             message: "Internal Server Error"
    //         })
    //     }
    // })




    return router

}