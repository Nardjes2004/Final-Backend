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
        }else{
            res.send({
                success: false,
                message: "Please fill all the infos"
            })
        }
    })
    
    // router.put('/', async (req, res) => {
    //     const body = req.body
        
    //     const result = await productsCollection.findOneAndUpdate
    // })


    return router

}