import { Router } from "express";

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


    return router

}